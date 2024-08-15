import * as SQLite from 'expo-sqlite';
import * as MediaLibrary from 'expo-media-library';

interface songs {
    id: number;
    name: string;
    pathto: string;
};

const initDatabase = async () => {
    const db = await SQLite.openDatabaseAsync('MainDB');
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

/*const getSongs = async (): Promise<any[]> => {
    const db = await SQLite.openDatabaseAsync('MainDB');
    if (!db) throw new Error('Database not initialized');
    
    const result = await db.getAllAsync<songs>(`SELECT * FROM songs`);
    return result[0].rows._array;
  };*/


const addSong = async (name: string, pathto: string): Promise<void> => {
    const db = await SQLite.openDatabaseAsync('MainDB');
    if (!db) throw new Error('Database not initialized');

    const statement = await db.prepareAsync(
        'INSERT OR IGNORE INTO songs (name, pathto) VALUES ($name, $pathto)'
    );
    try {
        let result = await statement.executeAsync({ $name: name, $pathto: pathto });
        console.log(result.lastInsertRowId, result.changes);
      } finally {
        await statement.finalizeAsync();
      }
    
};

const addMultipleSongs = async (assets: MediaLibrary.Asset[]): Promise<void> => {
    const db = await SQLite.openDatabaseAsync('MainDB');
    if (!db) throw new Error('Database not initialized');

    const statement = await db.prepareAsync(
        'INSERT OR IGNORE INTO songs (name, pathto) VALUES ($name, $pathto)'
    );
    try {
        for (const asset of assets) {
            let result = await statement.executeAsync({ $name: asset.filename, $pathto: asset.uri });
            console.log(result.lastInsertRowId, result.changes);
        };
    } finally {
        await statement.finalizeAsync();
    };
};

export { initDatabase, addSong, addMultipleSongs };