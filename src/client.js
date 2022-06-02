import axios from 'axios'
import { Transform, Writable } from 'stream'
const url = 'http://localhost:4001'


async function consume(){
    const response = await axios({
        url,
        method: 'get',
        responseType: 'stream'
    })

    return response.data
}


const stream = await consume()

stream
    .pipe(new Transform({
        transform(chunk, encoding, cb){
            const item = JSON.parse(chunk)
            let name = item.name
            const idNumber = /\d+/.exec(item.name)[0]
            
            cb(null, JSON.stringify({
                ...item,
                name: name.concat(idNumber % 2 === 0 ? ' é par' : ' é ímpar')
            }))
        }
    }))
    .pipe(new Writable({
        write(chunk, encoding, cb){
            console.log('chegou aqui o pacote ein ', JSON.parse(chunk))
            cb()
        }
    }))