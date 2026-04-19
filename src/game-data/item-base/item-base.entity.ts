import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { NpcShopItemEntity } from '../npc-shop-item/npc-shop-item.entity';

/**
 * ItemBaseEntity — Catalog item của game.
 *
 * ──────────────────────────────────────────────────────────────────
 * TẠI SAO CÓ BẢNG NÀY?
 * ──────────────────────────────────────────────────────────────────
 * Thay vì lưu tên item trực tiếp vào npc_shop_item dưới dạng string:
 *
 *   npc_shop_item: { tenItem: "Bông tai Porata", gia: 1000, ... }
 *
 * Ta tách ra thành 2 bảng với quan hệ FK:
 *
 *   item_base:     { id: 6, ten: "Bông tai Porata", ma: "bongtaic1" }
 *   npc_shop_item: { item_base_id: 6, gia: 1000, ... }
 *
 * Lý do: "Bông tai Porata" là một định nghĩa — nó không thuộc về
 * bất kỳ NPC hay shop nào. Tách ra để định nghĩa 1 lần, dùng lại
 * nhiều nơi mà không lo inconsistency.
 *
 * ──────────────────────────────────────────────────────────────────
 * ANALOGY VỚI DATABASE INDEX — ĐỌC KỸ PHẦN NÀY
 * ──────────────────────────────────────────────────────────────────
 * Pattern này tương đồng với cách InnoDB (MySQL) và PostgreSQL xử lý
 * index theo 2 chiến lược khác nhau:
 *
 * [InnoDB — Clustered Index]
 *   - Mọi secondary index không lưu địa chỉ vật lý của row, mà lưu
 *     primary key của row đó.
 *   - Khi row bị update (ví dụ đổi tên), row data thay đổi nhưng
 *     primary key không đổi → secondary index không cần cập nhật.
 *   - Chỉ cần đi qua 1 bước nhảy: secondary index → PK → row data.
 *
 * [PostgreSQL — Heap Storage]
 *   - Secondary index lưu địa chỉ vật lý (ctid) của row trong heap.
 *   - Khi row bị UPDATE, PostgreSQL tạo ra một row mới ở địa chỉ mới,
 *     row cũ được đánh dấu dead tuple.
 *   - Địa chỉ thay đổi → TẤT CẢ secondary index trỏ đến row đó đều
 *     phải được cập nhật → expensive với bảng có nhiều index.
 *   - PostgreSQL có HOT (Heap Only Tuple) để giảm thiểu trường hợp
 *     này, nhưng chỉ hoạt động khi update không động vào indexed column
 *     và còn space trên cùng page.
 *
 * [Pattern này hoạt động giống InnoDB]
 *
 *   item_base.id          ≈  Primary Key (không bao giờ thay đổi)
 *   item_base.ten / ma    ≈  Row data thật sự (có thể thay đổi)
 *   npc_shop_item.item_base_id (FK) ≈  Secondary index — chỉ lưu PK
 *
 *   Khi admin đổi tên "Bông tai Porata" → "Bông Tai Porata C1":
 *     - Chỉ update 1 row trong item_base (id=6, ten=...)
 *     - item_base_id=6 trong npc_shop_item không đổi
 *     - Server JOIN tự trả về tên mới — không cần update gì thêm
 *
 *   Ngược lại nếu lưu string trực tiếp (kiểu PostgreSQL heap):
 *     - Phải UPDATE tất cả npc_shop_item rows có tenItem = "Bông tai Porata"
 *     - Nếu quên 1 row → data inconsistent
 *     - Nếu có thêm bảng khác cũng dùng tên này → phải update tất cả
 *
 * ──────────────────────────────────────────────────────────────────
 * CONSTRAINT QUAN TRỌNG
 * ──────────────────────────────────────────────────────────────────
 * - ten phải unique: tránh admin tạo 2 item cùng tên gây nhầm lẫn,
 *   và đảm bảo client mapping qua TEN_TO_INFO luôn ra đúng 1 item.
 *
 * - ma phải unique: là định danh kỹ thuật để admin biết asset nằm ở
 *   đâu trong game client (texture path, animation...). Không dùng
 *   trong logic, chỉ dùng để tham khảo.
 *
 * - ten phải khớp CHÍNH XÁC với key trong TEN_TO_INFO của game client
 *   (Java). Sai 1 ký tự, kể cả dấu cách hay viết hoa, là client không
 *   mapping được → item không hiện trong shop. Đây là coupling duy nhất
 *   giữa server data và client code — cần document rõ khi thêm item mới.
 *
 * ──────────────────────────────────────────────────────────────────
 * KHI THÊM ITEM MỚI
 * ──────────────────────────────────────────────────────────────────
 * 1. Thêm asset vào game client (texture, animation...)
 * 2. Thêm entry vào TEN_TO_INFO trong ItemThuongXuLi.java
 * 3. POST /game-data/item-base với ten khớp CHÍNH XÁC TEN_TO_INFO
 * 4. POST /game-data/npc-shop để gán item vào shop NPC
 * Không cần release client mới nếu item đã có sẵn trong TEN_TO_INFO.
 */
@Entity('item_base')
export class ItemBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  ten: string;  // "Bông tai Porata" — key khớp với TEN_TO_INFO client

  @Column({ unique: true, length: 50 })
  ma: string;   // "bongtaic1" — mã định danh

  @OneToMany(() => NpcShopItemEntity, (shop) => shop.itemBase)
  shopItems: NpcShopItemEntity[];
}

// Không có item_base — admin tự ghi
// Admin thêm shop item:
//   tenItem: "Bông tai Porata"   ← gõ tay, dễ typo
//   gia: 1000
//   loaiTien: "NGOC"
//   tab: "DAC_BIET"
// Vấn đề:
// Admin 1 gõ: "Bông tai Porata"
// Admin 2 gõ: "bông tai porata"   ← khác case
// Admin 3 gõ: "Bông Tai Porata"   ← khác case

// → Client TEN_TO_INFO.get() miss hết
// → Item không hiện trong shop
// → Bug âm thầm, khó debug

// Có item_base — chọn từ danh sách
// Admin thêm shop item:
//   item_base_id: 6   ← chọn từ dropdown, không thể sai
//   gia: 1000
//   loaiTien: "NGOC"
//   tab: "DAC_BIET"
// item_base bảng:
//   id=6 | ten="Bông tai Porata" | ma="bongtaic1"

// → Server join → trả về ten chính xác 100%
// → Client mapping luôn đúng
// → Không bao giờ typo

// Lợi ích khác
// Muốn đổi tên "Bông tai Porata" → "Bông Tai Porata C1"
//   Không có item_base: sửa tất cả npc_shop_item.tenItem đang dùng
//   Có item_base:       sửa 1 dòng trong item_base → tất cả tự update

// Muốn biết item nào đang bán ở shop nào:
//   Không có item_base: query text search, dễ miss
//   Có item_base:       SELECT * FROM npc_shop_item WHERE item_base_id = 6
// Tóm lại item_base là single source of truth cho item catalog — admin chỉ định nghĩa item 1 lần, dùng lại ở nhiều chỗ mà không lo inconsistent.