# Tabletop-RPG Manager

> Disclaimer: Dieses Projekt ist ein Hobbyprojekt und wird nebenbei entwickelt je nach dem wieviel Zeit wir aufbringen können.

Ein Tabletop-RPG Online Tool für Spielleiter und Spieler von Dungeons and Dragons.

Features:

- Benutzerverwaltung mit Berechtigungssystem
- Charactermaker
- Autoimport von Monstern, Items und Zaubern aus dem Systemreferenzdokument von D&D
- Mehrere Spiele erstellen und leiten
  - Verliere nie den Überblick Quests, Events und NPCs
  - Kampfübersicht mit Tracker für vergangene Zeit
  - Trefferpunkte und Attribute mitteles Characterbogen für die Spieler
  - Erstelle Waffen und Items und Weise sie Nutzern zu
- Erstelle deinen eigenen Ingame Kalender und Welten
- Eigene NPCs und Items erstellen
- Wiki zum eigene Einträge erstellen mit Markdown.

## Installation (mittels Docker)

Zunächst benötigen wir den Code der Anwendung

```bash
git clone https://git2.lauch.eu/DnD/tabletop-rpg-manager-public.git
```

Nun können wir ein Docker Compose File erstellen.

```dockercompose
version: '3.9'

services:
  ttrpgmaster:
    container_name: ttrpgmaster
    hostname: "YOURHOSTNAME" #Hostname of the Server
    build:
      context: .
      dockerfile: Dockerfile
    restart: unless-stopped
    depends_on:
      - db
    environment:
      - NODE_ENV=production
      - PORT=3000
      - PGHOST=db
      - PGUSER=rpg
      - PGPASSWORD=123456
      - PGDATABASE=rpg
    ports:
      - "3000:3000" #Change Ports accordingly
    volumes:
      - /yourUploadsSave:/app/upload #Set Upload Folder
      - /yourRulesetSave:/app/ruleset #Set Ruleset Folder
  db:
    image: postgres
    restart: always
    environment:
      - POSTGRES_USER=rpg
      - POSTGRES_PASSWORD=123456
      - POSTGRES_DB=rpg
    volumes:
      - /yourDatabaseSave:/var/lib/postgresql/data #Set Database Folder
```

Nun können wir mittels Dockercompose den Prozess starten:

```bash
docker-compose up --build
```

## Nutzung

Kommt bald :)

## Entwicklung

Merge-Requests bitte nur an https://git2.lauch.eu/DnD/tabletop-rpg-manager-public.git stellen. Github dient nur als Backup.
