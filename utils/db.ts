import * as SQLite from 'expo-sqlite';
import * as MediaLibrary from 'expo-media-library';
import readline from 'readline';

interface Song {
    id: number;
    name: string;
    pathto: string;
}

interface Tag {
    id: number;
    name: string;
    color: string;
}

interface Attribute {
    id: number;
    name: string;
    action: string;
    priority: number;
}

interface SongTag {
    song_id: number;
    tag_id: number;
}

const initDatabase = async () => {
    const db = await SQLite.openDatabaseAsync('MainDB');
    /*await db.execAsync('DROP TABLE IF EXISTS songs');
    await db.execAsync('DROP TABLE IF EXISTS tags');
    await db.execAsync('DROP TABLE IF EXISTS attributes');
    await db.execAsync('DROP TABLE IF EXISTS song_tags');*/

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


const addMultipleSongs = async (assets: MediaLibrary.Asset[]): Promise<void> => {
    const db = await SQLite.openDatabaseAsync('MainDB');
    if (!db) throw new Error('Database not initialized');


    for (const asset of assets) {
        //console.log(asset);
        if (await db.getFirstAsync(`SELECT id FROM songs WHERE name = $name`, { $name: asset.filename }) == null) {

            const prepareAddSong = await db.prepareAsync(
                'INSERT INTO songs (name, pathto) VALUES ($name, $pathto)'
            );
            try {
                let result = await prepareAddSong.executeAsync({ $name: asset.filename, $pathto: asset.uri });

                
                const tagsByPath = asset.uri.split('/');
                const tags = tagsByPath.slice(5, tagsByPath.length - 1);
                for (const tag of tags) {
                    const prepareAddTag = await db.prepareAsync(
                        'INSERT INTO tags (name, color) VALUES ($name, $color)'
                    );
                    const tagExist = await db.getFirstAsync(`SELECT id FROM tags WHERE name = $name`, { $name: tag }) as { id: number } | null;
                    let tagId: number;
                    if (tagExist == null) {
                        try {
                            let tagResult = await prepareAddTag.executeAsync({ $name: tag, $color: 'pink' });
                            tagId = tagResult.lastInsertRowId;
                        }
                        finally {
                            await prepareAddTag.finalizeAsync();
                        }
                    }
                    else {
                        tagId = tagExist.id;
                        console.log('Tag already exists');
                    }
                    
                    let songTagResult = await db.execAsync(`INSERT INTO song_tags (song_id, tag_id) VALUES (${result.lastInsertRowId}, ${tagId})`);

                }

            } finally {
                await prepareAddSong.finalizeAsync();
            };
            
        } else {
            console.log('Song already exists');
        };
    };

    const lines = await db.getAllAsync('SELECT * FROM songs') as Song[];

    for (const line of lines) {
        console.log(line);
        const tags = await db.getAllAsync('SELECT * FROM song_tags WHERE song_id = $song_id', { $song_id: line.id }) as SongTag[];
        for (const tag of tags) {
            console.log(await db.getFirstAsync('SELECT * FROM tags WHERE id = $tag_id', { $tag_id: tag.tag_id }));
        }
    };
    console.log('end of addMultipleSongs');
};

export { initDatabase, addMultipleSongs };