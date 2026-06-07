const DB_NAME = 'GastosDB';
const DB_VERSION =  1;
const STORE_NAME = 'gastos';

export const abrirDB = () => {
    console.log('Open DB');
    
    return new Promise((resolve, reject) => {
        const request =  indexedDB.open(DB_NAME, DB_VERSION);
        // Si tenemos un error
        request.addEventListener('error', () => {
            reject( request.error);
        })
        // Resultado correcto
        request.addEventListener('success', () => {
            resolve(request.result);
        })
        // Creamos el Store
        request.addEventListener('upgradeneeded', (event) => {
            const db = event.target.result;
            console.log({db});
              //db.createObjectStore(STORE_NAME, { keyPath: '_id'});
            // Si no existe el store lo creamos
            if( !db.objectStoreNames.contains( STORE_NAME) ){
                db.createObjectStore(STORE_NAME, { keyPath: '_id'});
            }
        })
    })
}


export const guardarLocal = async ( data ) => {
    const db = await abrirDB();
    console.log(db);
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const request = store.add( data );

        request.addEventListener('success', () => {
            resolve();
        })

        request.addEventListener('error', () => {
            reject(request.error);
        });
    });
}

export const obtenerLocal = async() => {
    const db = await abrirDB();

    return new Promise( (resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.getAll();

        request.addEventListener('success', () => {
            resolve( request.result);
        })

        request.addEventListener('error', () => {
            reject(request.error);
        });
    })
}