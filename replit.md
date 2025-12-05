# XinChao Vietnam Daily News System

## Overview
Automated news workflow system for XinChao Vietnam, a 23-year-old Korean-language magazine in Vietnam. The system crawls Vietnamese and Korean news sources, translates them to Korean using GPT API, and publishes to WordPress.

## Architecture

### Tech Stack
- **Frontend/Backend**: Next.js 16 (App Router)
- **Database**: SQLite with Prisma ORM
- **Translation**: OpenAI GPT API
- **Publishing**: WordPress REST API
- **Port**: 5000

### News Sources
- VnExpress (Vietnamese & English)
- Yonhap News (Korean)
- TuoiTre News
- ThanhNien
- InsideVina
- VNA

### WordPress Publishing
Single publication target on chaovietnam.co.kr:

| Target | Category IDs | Description |
|--------|-------------|-------------|
| 데일리뉴스 (Full Article) | 6, 31 | Complete translated articles |

**참고**: 요약본(카테고리 711) 별도 게시 삭제됨. Jenny 플러그인이 본문에서 직접 excerpt를 가져옴.

### WordPress Plugins (Required)
1. **XinChao Image Uploader** (`xinchao-image-uploader.php`)
   - REST endpoint for server-side image download
   - Bypasses hotlink protection from news sites
   
2. **Jenny Daily News Display** (`jenny-daily-news.php`) v1.3
   - Displays news cards using `[daily_news_list]` shortcode
   - Fetches from category 31 (본문)
   - Uses WordPress excerpt for summary
   - Links directly to full article (permalink)

## Key Files

| File | Purpose |
|------|---------|
| `lib/publisher.js` | WordPress publishing logic |
| `lib/openai.js` | GPT translation |
| `lib/prisma.js` | Database client |
| `app/admin/page.js` | Admin dashboard |
| `app/admin/actions.js` | Server actions for publishing |
| `scripts/crawler.js` | News crawler |

## Publishing Workflow

1. **Crawl** → Fetch news from sources (8am daily)
2. **Select** → Admin selects ~20 articles
3. **Translate** → GPT translates to Korean
4. **Publish** → Full article to 데일리뉴스 (category 31)
   - Image uploaded to WordPress Media Library
   - Featured image set
   - Jenny plugin reads from this category directly

## Image Handling

| News Source | Image Upload Status | Method |
|-------------|---------------------|--------|
| VnExpress | ✅ Works | WordPress plugin |
| VnExpress VN | ✅ Works | WordPress plugin |
| InsideVina | ✅ Works | WordPress plugin |
| TuoiTre | ✅ Works | WordPress plugin |
| ThanhNien | ✅ Works | WordPress plugin |
| VNA | ✅ Works | WordPress plugin |
| Yonhap | ✅ Works | Replit → WordPress (SSL bypass) |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | GPT API key for translation |
| `WORDPRESS_APP_PASSWORD` | WordPress application password |
| `WORDPRESS_URL` | WordPress site URL (default: https://chaovietnam.co.kr) |
| `WORDPRESS_USERNAME` | WordPress username (default: chaovietnam) |
| `DATABASE_URL` | SQLite database path |

## Card News (전령 카드/카드 엽서)

카드 엽서는 오늘의 주요 뉴스를 한눈에 보여주는 시각적 카드입니다.

### 구성 요소
- **특집 뉴스 (TopNews)**: 왼쪽 60% 영역, 큰 이미지와 제목
- **카드 뉴스 (4개)**: 오른쪽 40% 영역, 4개의 작은 카드
- **날씨/환율 정보**: 하단 푸터 영역

### 사용 방법
1. 관리자 대시보드에서 뉴스 선택 시 `isTopNews`, `isCardNews` 지정
2. `/admin/card-news` 페이지에서 카드 엽서 미리보기
3. **"WordPress에 카드 엽서 게시"** 버튼으로 WordPress에 자동 게시

### 관련 파일
| File | Purpose |
|------|---------|
| `app/admin/card-news/page.js` | 카드 엽서 미리보기 페이지 |
| `app/admin/card-news/CardNewsPreviewMars.js` | Mars Explorer 디자인 |
| `app/api/publish-card-news/route.js` | WordPress 게시 API |
| `lib/publisher.js` | `publishCardNewsToWordPress()` 함수 |

### WordPress 게시 결과
- **뉴스 터미널 페이지**: `https://chaovietnam.co.kr/daily-news-terminal/`
- **Featured Image**: 카드 엽서 JPEG 이미지 (뉴스 터미널 페이지 대표이미지로 설정)
- **OG 이미지**: Featured Image가 SNS 공유 시 미리보기로 표시됨

### SNS 공유 URL
| 플랫폼 | URL | 비고 |
|--------|-----|------|
| Facebook | `https://chaovietnam.co.kr/daily-news-terminal/` | 바로 작동 |
| 카카오톡 | `https://chaovietnam.co.kr/daily-news-terminal/` | 캐시 초기화 필요 시 [카카오 디버거](https://developers.kakao.com/tool/clear/og) 사용 |
| Zalo | `https://chaovietnam.co.kr/daily-news-terminal/?v=날짜` | 예: `?v=1204` (12월4일) |

### 일일 워크플로우
1. 관리자 대시보드에서 뉴스 선택 (TopNews 1개, CardNews 4개)
2. `/admin/card-news` 페이지에서 **"WordPress에 카드 엽서 게시"** 클릭
3. SNS에서 뉴스 터미널 URL 공유

## Recent Changes (Dec 5, 2025)

- **요약본 게시 제거**: 본문만 WordPress에 게시 (카테고리 31)
- **Jenny 플러그인 v1.3**: 본문(31)에서 직접 가져오고, excerpt 사용, permalink로 링크
- **게시 로직 단순화**: `publishToDailySite` 제거, 본문 하나만 게시

### Dec 4, 2025
- **Yonhap SSL fix**: Images downloaded via Replit first, then uploaded to WordPress
- **VNA crawler fix**: SSL legacy support enabled
- **Card News WordPress 게시**: 카드 엽서를 WordPress에 직접 게시하는 기능 추가
- **카드 엽서 JPEG 변환**: PNG → JPEG (92% 품질), 파일 크기 86% 감소 (2.4MB → 339KB)
- **뉴스 터미널 대표이미지**: 카드 엽서가 뉴스 터미널 페이지의 Featured Image로 설정
- **SNS 공유 성공**: Facebook, 카카오톡, Zalo 모두 OG 이미지 표시 확인

## Notes

- All 7 news sources now working with images
- Card news uses client-side html2canvas for image generation (Puppeteer not available)
