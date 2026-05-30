# AGENTS.md

## Cel projektu
To repozytorium zawiera **fanowski, niekomercyjny** projekt gry 2D inspirowanej filmami i książkami z uniwersum **Łowcy androidów (Blade Runner)**.

Gra ma charakter:
- strzelanki 2D,
- klimatu cyberpunk / noir,
- szybkiej, responsywnej rozgrywki opartej na scenach Phaser.

## Stack technologiczny
- `TypeScript` (tryb `strict` w `tsconfig.json`)
- `Phaser.js` (silnik gry)
- `Vite` (dev server i build)

## Główne zasady pracy
- Trzymaj rozwiązania proste (`KISS`), bez nadmiernej architektury.
- Stosuj `DRY`: zanim dodasz nową abstrakcję, sprawdź czy podobna już istnieje.
- Pisz małe, jednofunkcyjne moduły i funkcje (`SRP`).
- Używaj czytelnych nazw domenowych (np. mechanika, AI, input, UI, kolizje).
- Unikaj magic numbers/stringów: wyciągaj je do stałych konfiguracyjnych.
- Zmiany zachowania gry wymagają aktualizacji lub dodania testów (jeśli dotyczy modułu testowanego).

## Standardy TypeScript
- Nie używaj `any`, chyba że jest to jawnie uzasadnione.
- Preferuj `unknown` + zawężanie typów (type guardy).
- Dla eksportowanych funkcji i metod dodawaj jawne typy zwrotu.
- Dla wariantów stanu używaj unii dyskryminowanych + wyczerpującego `switch` z kontrolą `never`.
- `type` dla unii/mapped types, `interface` dla kontraktów rozszerzalnych.
- Preferuj niemutowalność (`readonly`, kopie obiektów/tablic) zamiast mutacji in-place.
- Unikaj argumentów typu boolean trap; używaj obiektu opcji.
- Błędy async obsługuj jawnie, nie wyciszaj wyjątków.
- Utrzymuj side effecty na granicach (np. scena, IO); logikę rdzenia trzymaj możliwie czystą.

## Konwencje Phaser / gameplay
- Każda scena powinna mieć jasno określoną odpowiedzialność (np. boot, preload, menu, gameplay, game over).
- Logikę rozgrywki oddzielaj od warstwy prezentacji/UI.
- Komponenty wielokrotnego użycia (animacje, efekty, obiekty sceny) trzymaj jako reużywalne klasy/helpers.
- Balans rozgrywki (obrażenia, cooldowny, prędkości, spawn rate) trzymaj w konfiguracji, nie „na sztywno” w logice.
- Jeśli zmieniasz mechanikę strzelania/ruchu/kolizji, dodaj krótki opis wpływu na gameplay w PR/commicie.

## Struktura repo (orientacyjnie)
- `src/game/scenes` - sceny Phaser
- `src/game/scene-objects` - obiekty i elementy świata
- `src/game/characters` - postacie i ich logika
- `src/game/ui-components` - komponenty UI
- `src/game/config` - konfiguracja gry
- `public/assets` - assety statyczne

## Komendy developerskie
- `npm run dev` - start dev servera
- `npm run build` - build produkcyjny
- `npm run dev-nolog` - dev bez telemetry `log.js`
- `npm run build-nolog` - build bez telemetry `log.js`

## Jakość i review
- Przy zmianach funkcjonalnych zawsze sprawdź:
  - czy nie ma regresji w scenach startowych (`Boot`, `Preloader`, `MainMenu`, `Game`),
  - czy assety i klucze loadera są spójne,
  - czy typy publicznych API pozostały stabilne.
- Refaktoruj, gdy rośnie duplikacja lub złożoność.
- Komentarze dodawaj oszczędnie, tylko tam gdzie intencja nie jest oczywista z kodu.

## Ograniczenia IP i zakres projektu
- To projekt fanowski: nie wprowadzaj zmian sugerujących wykorzystanie komercyjne.
- Zachowuj klimat inspiracji Blade Runner, ale dbaj o techniczną oryginalność implementacji i kodu.
