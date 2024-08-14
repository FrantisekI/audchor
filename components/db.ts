import * as SQLite from 'expo-sqlite';

const db = await SQLite.openDatabaseAsync('MainDB');
const initDatabase = async () => {
    try {
        await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS songs (
            id INTEGER PRIMARY KEY NOT NULL, 
            name TEXT NOT NULL, 
            pathto TEXT NOT NULL);
    
        CREATE TABLE IF NOT EXISTS tags (
            id INTEGER PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            color TEXT NOT NULL);
    
        CREATE TABLE IF NOT EXISTS attributes (
            id INTEGER PRIMARY KEY NOT NULL,
            name TEXT NOT NOT NULL,
            action TEXT NOT NULL,
            priority INTEGER NOT NULL);
    
        CREATE TABLE IF NOT EXISTS song_tags (
            PRIMARY KEY (song_id, tag_id),
            song_id INTEGER NOT NULL,
            tag_id INTEGER NOT NULL);
        `);
        
        console.log('Database initialized');
    } catch (e) {
        console.log(e);
    };
};

export { initDatabase }