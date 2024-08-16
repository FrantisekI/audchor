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
            name TEXT NOT NULL UNIQUE, 
            pathto TEXT NOT NULL
            );
    
        CREATE TABLE IF NOT EXISTS tags (
            id INTEGER PRIMARY KEY NOT NULL,
            name TEXT NOT NULL UNIQUE,
            color TEXT NOT NULL);
    
        CREATE TABLE IF NOT EXISTS attributes (
            id INTEGER PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            action TEXT NOT NULL,
            priority INTEGER NOT NULL);
    
        CREATE TABLE IF NOT EXISTS song_tags (
            song_id INTEGER NOT NULL,
            tag_id INTEGER NOT NULL,
            PRIMARY KEY (song_id, tag_id),
            FOREIGN KEY (song_id) REFERENCES songs (id),
            FOREIGN KEY (tag_id) REFERENCES tags (id));
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

    const prepareAddSong = await db.prepareAsync(
        'INSERT OR IGNORE INTO songs (name, pathto) VALUES ($name, $pathto)'
    );


    const prepareAddTag = await db.prepareAsync(
        'INSERT OR IGNORE INTO tags (name, color) VALUES ($name, $color)'
    );

    const prepareAddSongTag = await db.prepareAsync(
        'INSERT OR IGNORE INTO song_tags (song_id, tag_id) VALUES ($song_id, $tag_id)'
    );

    try {
        let result = await prepareAddSong.executeAsync({ $name: name, $pathto: pathto });
        console.log(result.lastInsertRowId, result.changes);
    } finally {
        await prepareAddSong.finalizeAsync();
    }

};

const addMultipleSongs = async (assets: MediaLibrary.Asset[]): Promise<void> => {
    console.log('bob')
    const db = await SQLite.openDatabaseAsync('MainDB');
    if (!db) throw new Error('Database not initialized');

    const statement = await db.prepareAsync(
        'INSERT INTO songs (name, pathto) VALUES ($name, $pathto) ON CONFLICT($name) DO NOTHING'
    );

    const prepareAddTag = await db.prepareAsync(
        'INSERT OR IGNORE INTO tags (name, color) VALUES ($name, $color)'
    );

    const prepareAddSongTag = await db.prepareAsync(
        'INSERT OR IGNORE INTO song_tags (song_id, tag_id) VALUES ($song_id, $tag_id)'
    );

    try {
        for (const asset of assets) {
            if (await db.getFirstAsync(`SELECT id FROM songs WHERE 
                name = $name`) == null) {

                let result = await statement.executeAsync({ $name: asset.filename, $pathto: asset.uri });
                console.log(result);




                const tagsByPath = asset.uri.split('/');
                const tags = tagsByPath.slice(5, tagsByPath.length - 1);
                for (const tag of tags) {
                    const tagExist = await db.getFirstAsync(`SELECT id FROM tags WHERE name = $name`, { $name: tag }) as { id: number }[];
                    let tagId : number;
                    if (tagExist == null) {
                        let tagResult = await prepareAddTag.executeAsync({ $name: tag, $color: 'pink' });
                        console.log(tagResult);
                        tagId = tagResult.lastInsertRowId;
                    }
                    else {
                        tagId = tagExist[0].id;
                        console.log('Tag already exists');
                    }
                    //add song tag relation
                    let songTagResult = await prepareAddSongTag.executeAsync({ $song_id: result.lastInsertRowId, $tag_id: tagId });
                    
                }
                console.log(tags);
                let tag = await prepareAddTag.executeAsync({ $name: 'tag', $color: 'red' });
                for (const line of await db.getAllAsync('SELECT * FROM tags')) {
                    console.log(line);
                };
            };
        };
    } finally {
        await statement.finalizeAsync();
    };
};

export { initDatabase, addSong, addMultipleSongs };