import  {randomUUID} from 'crypto'
import http from 'http'
import { Readable } from 'stream'

function* run () {
    for (let i = 0; i <= 999; i++){
        const data = {
            id: randomUUID(),
            name: `Index-${i}`
        }

        yield data
    }
}

async function handler(request, response){
    const readable = new Readable({
        read(){
            for(const data of run()){
                console.log('sending', data )
                this.push(JSON.stringify(data) + "\n")
            }

            // informar que os dados acabaram
            this.push(null)
        }
    })

    readable
    .pipe(response)
}


http.createServer(handler).listen(4001).on('listening', () => {
    console.log('server running at 4001')
})