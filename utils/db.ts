import * as SQLite from 'expo-sqlite';
import * as MediaLibrary from 'expo-media-library';
import readline from 'readline';

interface songs {
    id: number;
    name: string;
    pathto: string;
};

const initDatabase = async () => {
    const db = await SQLite.openDatabaseAsync('MainDB');
    await db.execAsync('DROP TABLE IF EXISTS songs');
    await db.execAsync('DROP TABLE IF EXISTS tags');
    await db.execAsync('DROP TABLE IF EXISTS attributes');
    await db.execAsync('DROP TABLE IF EXISTS song_tags');
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

        console.log('Tables cleared');
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


const addMultipleSongs = async (assets: MediaLibrary.Asset[]): Promise<void> => {
    //console.log(assets);
    console.log('bob');
    const db = await SQLite.openDatabaseAsync('MainDB');
    if (!db) throw new Error('Database not initialized');

    const prepareAddSong = await db.prepareAsync(
        'INSERT INTO songs (name, pathto) VALUES ($name, $pathto)'
    );

    const prepareAddTag = await db.prepareAsync(
        'INSERT INTO tags (name, color) VALUES ($name, $color)'
    );

    /*const prepareAddSongTag = await db.prepareAsync(
        'INSERT INTO song_tags (song_id, tag_id) VALUES ($song_id, $tag_id)'
    );*/

    assets.forEach((asset) => {
        console.log(asset);
    });

    for (const asset of assets) {
        console.log(asset);
        if (await db.getFirstAsync(`SELECT id FROM songs WHERE name = $name`, { $name: asset.filename }) == null) {

            try {
                let result = await prepareAddSong.executeAsync({ $name: asset.filename, $pathto: asset.uri });
                console.log('result', result);

                const tagsByPath = asset.uri.split('/');
                const tags = tagsByPath.slice(5, tagsByPath.length - 1);
                for (const tag of tags) {
                    console.log('tag', tag);
                    const tagExist = await db.getFirstAsync(`SELECT id FROM tags WHERE name = $name`, { $name: tag }) as { id: number }[];
                    let tagId: number;
                    if (tagExist == null) {
                        try {
                            let tagResult = await prepareAddTag.executeAsync({ $name: tag, $color: 'pink' });
                            console.log('tagResult', tagResult);
                            tagId = tagResult.lastInsertRowId;
                        }
                        finally {
                            await prepareAddTag.finalizeAsync();
                        }
                    }
                    else {
                        tagId = tagExist[0].id;
                        console.log('Tag already exists');
                    }
                    //add song tag relation

                    let songTagResult = await db.execAsync(`INSERT INTO song_tags (song_id, tag_id) VALUES (${result.lastInsertRowId}, ${tagId})`);
                    // prepareAddSongTag.executeAsync({ $song_id: result.lastInsertRowId, $tag_id: tagId });

                }
                console.log('tags', tags);

            } finally {
                await prepareAddSong.finalizeAsync();
            };
            console.log('it had happened');
        } else {
            console.log('Song already exists');
        };
    };
    for (const line of await db.getAllAsync('SELECT * FROM songs')) {
        console.log(line);
    };
    console.log('Songs added sidf');
};

export { initDatabase, addMultipleSongs };