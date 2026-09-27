# VIET5ERS — Trade Beyond Limits

Website phong cách SpaceX dành cho cộng đồng VIET5ERS: dark cosmic theme, hero 3D tương tác, scroll animation mượt mà, static export chạy trên GitHub Pages.

## Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| Framework | **Next.js 14** (App Router, static export) |
| 3D | **React Three Fiber** + drei + postprocessing (Bloom, Vignette) |
| Animation | **Framer Motion** + **Lenis** smooth scroll |
| Styling | **Tailwind CSS** |
| Ngôn ngữ | **TypeScript** |

## Chạy local

```bash
npm install        # cài dependencies
npm run dev        # dev server → http://localhost:3000
npm run build      # static export → ./out
npm run type-check # kiểm tra TypeScript
```

## Cấu trúc

```
src/
├── app/                # layout, page, globals.css, icon.svg
├── components/
│   ├── three/HeroScene.tsx   # scene 3D: hành tinh, vành đai, sao, bloom
│   ├── Hero.tsx              # headline + telemetry + 3D canvas
│   ├── Navigation.tsx        # nav cố định + mission bar + menu mobile
│   ├── Stats.tsx             # bộ đếm số động (SpaceX style)
│   ├── Programs.tsx          # 3 "vehicle": Academy / Funding / Network
│   ├── Missions.tsx          # timeline roadmap
│   ├── About.tsx             # manifesto + ảnh parallax + pillars
│   ├── CTA.tsx               # form đăng ký Cohort 07
│   └── Footer.tsx
├── data/content.ts     # ⭐ TOÀN BỘ nội dung text/số liệu nằm ở đây
└── lib/utils.ts        # cn(), scroll helpers
```

## Chỉnh sửa nội dung

Mọi text, số liệu, roadmap — sửa trong **`src/data/content.ts`**. Không cần đụng vào component.

Màu chủ đạo (accent teal `#00d4aa`, gold `#ffd700`) — sửa trong **`tailwind.config.ts`**.

Ảnh OG / about — thay file trong **`public/images/`** và **`public/og.jpg`**.

## Deploy lên GitHub Pages

Repo đã có workflow `.github/workflows/nextjs.yml`:

1. Vào **Settings → Pages** của repo, chọn **Source: GitHub Actions**.
2. Merge code vào nhánh `main` — workflow tự build & deploy ra `out/`.
3. Site chạy tại `https://<owner>.github.io/viet5ers.github.io/` (workflow tự set `BASE_PATH`).

> Nếu repo được đổi tên thành `<owner>.github.io` (site gốc), `BASE_PATH` sẽ cần bỏ trống — sửa bước "Set base path" trong workflow.

## Ghi chú

- Nội dung hiện tại là placeholder theo chủ đề trading — thay bằng nội dung thật trong `src/data/content.ts`.
- Form đăng ký ở section CTA hiện chỉ xử lý phía client — cần nối endpoint (Mailchimp/Formspree...) ở `src/components/CTA.tsx`.
