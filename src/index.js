const prompt = require('prompt-sync') ();
const {Canvas, loadImage, FontLibrary} = require('skia-canvas');
const fs = require('fs');
const path = require('path');

console.log(`________  _______   ________  _______  _________  ___  ________  ________  ________  _________    ___    ___ 
|\\   ___ \\|\\  ___ \\ |\\   ____\\|\\  ___ \\|\\___   ___\\\\  \\|\\   __  \\|\\   __  \\|\\   ____\\|\\___   ___\\ |\\  \\  /  /|
\\ \\  \\_|\\ \\ \\   __/|\\ \\  \\___|\\ \\   __/\\|___ \\  \\_\\ \\  \\ \\  \\|\\  \\ \\  \\|\\  \\ \\  \\___|\\|___ \\  \\_| \\ \\  \\/  / /
 \\ \\  \\ \\\\ \\ \\  \\_|/_\\ \\_____  \\ \\  \\_|/__  \\ \\  \\ \\ \\  \\ \\   ____\\ \\   _  _\\ \\_____  \\   \\ \\  \\   \\ \\    / / 
  \\ \\  \\_\\\\ \\ \\  \\_|\\ \\|____|\\  \\ \\  \\_|\\ \\  \\ \\  \\ \\ \\  \\ \\  \\___|\\ \\  \\\\  \\\\|____|\\  \\   \\ \\  \\   \\/  /  /  
   \\ \\_______\\ \\_______\\____\\_\\  \\ \\_______\\  \\ \\__\\ \\ \\__\\ \\__\\    \\ \\__\\\\ _\\ ____\\_\\  \\   \\ \\__\\__/  / /    
    \\|_______|\\|_______|\\_________\\|_______|   \\|__|  \\|__|\\|__|     \\|__|\\|__|\\_________\\   \\|__|\\___/ /     
                       \\|_________|                                           \\|_________|       \\|___|/      `)
console.log(`________  ___  ___  _______   ________  _________   
|\\   ____\\|\\  \\|\\  \\|\\  ___ \\ |\\   __  \\|\\___   ___\\ 
\\ \\  \\___|\\ \\  \\\\\\  \\ \\   __/|\\ \\  \\|\\  \\|___ \\  \\_| 
 \\ \\  \\    \\ \\   __  \\ \\  \\_|/_\\ \\   __  \\   \\ \\  \\  
  \\ \\  \\____\\ \\  \\ \\  \\ \\  \\_|\\ \\ \\  \\ \\  \\   \\ \\  \\ 
   \\ \\_______\\ \\__\\ \\__\\ \\_______\\ \\__\\ \\__\\   \\ \\__\\
    \\|_______|\\|__|\\|__|\\|_______|\\|__|\\|__|    \\|__|`)

async function run() {
    try {
        let regexp = /[^a-zA-Zěščřžýáíéúůťďňó0-9. [\]]+/g

        console.log('\x1b[0m')
        console.log('\x1b[7m')

        let lekce = prompt("Napiš lekci: ");
        let limitRychlost = prompt("Napiš tvůj limit rychlosti: ").replace(",", ".");
        let limitChybovost = prompt("Napiš tvůj limit chybovosti (s desetinným místem): ").replace(",", ".");
        let znaky = prompt("Napiš počet znaků/úhozů: ");
        let rychlost = prompt("Napiš tvou vysněnou rychlost (s desetinným místem): ").replace(",", ".");
        let znamka = prompt("Napiš tvou vysněnou známku (pouze 1 nebo 2): ");
        let chybovostData = {"1": 0.3, "2": 0.6}
        let chybovostList = [];
        for (let i = 1; i<=Math.floor(chybovostData[znamka]/100*znaky); i++) {
            chybovostList.push((i/znaky*100).toFixed(2))
        }
        console.log(`\nMáš na výběr z těchto chybovostí: ${chybovostList.join(' | ')}`)
        let chybovost = prompt(`Napiš pořadí té chybovosti (například jestli chceš druhé, tak napiš 2): `)
        console.log()
        let nameJSON = JSON.parse(fs.readFileSync('./src/name.json', 'utf8'))
        if (nameJSON instanceof Object && !(nameJSON instanceof Array)) nameJSON = [nameJSON.name]
        let name;
        while (nameJSON.length) {
            console.log("Vyber si z předešlých jmen:")
            for (let i = 0; i<nameJSON.length; i++) {
                console.log(`${i}: ${nameJSON[i]}`)
            }
            console.log()
            let useName = prompt("Napiš pořadí jména, anebo napiš 'edit' pro odstranění nebo přidání jména na seznam: ")
            if (useName.toLowerCase() == "edit") {
                console.log()
                let addName = prompt("Napiš jméno, které chceš přidat nebo odebrat: ")
                console.log()
                if (nameJSON.includes(addName)) nameJSON.splice(nameJSON.indexOf(addName), 1)
                else nameJSON.push(addName)
                fs.writeFileSync('./src/name.json', JSON.stringify(nameJSON, null, 4))
            }
            else if (parseInt(useName) <= nameJSON.length-1 && parseInt(useName) >= 0) {
                name = nameJSON[parseInt(useName)]
                break
            }
        }
        if (!nameJSON.length) {
            name = prompt("Napiš tvoje uživatelské jméno (POUZE ČÍSLA A PÍSMENA BEZ DIAKRATIKY): ");
            fs.writeFileSync('./src/name.json', JSON.stringify([name], null, 4))
        }
        let customDatum;
        if (prompt("Chceš použít vlastní datum? (Y/N): ").toLowerCase() == "y") {
            customDatum = prompt("Napiš datum ve formátu 'DD:MM:YYYY' (např. 02.03.2023): ").split(".")
            for (let i in customDatum) {
                if (customDatum[i].length < 2) {
                    customDatum[i] = "0" + customDatum[i]
                }
            }
            customDatum = customDatum.join(".")
        }
        let customTime;
        if (prompt("Chceš použít vlastní čas? (Y/N): ").toLowerCase() == "y") {
            customTime = prompt("Napiš čas ve formátu 'hh:mm:ss' (např. 15:07:09): ").split(":")
            for (let i in customTime) {
                if (customTime[i].length < 2) {
                    customTime[i] = "0" + customTime[i]
                }
            }
            customTime = customTime.join(":")
        }


        if (!parseInt(lekce) || !parseInt(znaky) || !parseFloat(rychlost) || !parseFloat(znamka) || !parseFloat(limitChybovost) || !parseInt(limitRychlost)) {
            console.log('\x1b[0m')
            console.log('\x1b[41m')
            console.log("Parse Error: Chybně zadané hodnoty.. nejseš moc prestižní student jako")
            console.log('\x1b[0m')
            prompt()
            return
        }

        if (parseInt(lekce) <= 0 || parseInt(lekce) > 999 || name.match(regexp) || parseInt(rychlost) > 9999 || 0 > znamka || znamka > 2 || 0 > chybovost || chybovost > chybovostList.length) {
            console.log('\x1b[0m')
            console.log('\x1b[41m')
            console.log("Retardace Error: Chybně zadané hodnoty.. nejseš moc prestižní student jako")
            console.log('\x1b[0m')
            prompt()
            return
        }
        rychlost = parseFloat(rychlost).toFixed(1).toString()
        let chyby = chybovost
        chybovost = chybovostList[chybovost-1]
        let celkovyCasList = []
        for (let i=0; i<3; i++) {
            if (i == 0) celkovyCasList.push('00')
            else if (i==1) {
                let min = Math.floor(znaky/rychlost).toString()
                min.length == 1 ? celkovyCasList.push(`0${min}`) : celkovyCasList.push(min)
            } else if (i==2) {
                let sec = Math.round((znaky/rychlost-Math.floor(znaky/rychlost))*60).toString()
                sec.length == 1 ? celkovyCasList.push(`0${sec}`) : celkovyCasList.push(sec)
            }
        }
        let celkovyCas = celkovyCasList.join(':') 

        const date = new Date();
        const dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        let datum = customDatum ? customTime ? `${customDatum} ${customTime}` : `${customDatum} ${date.toLocaleDateString("fr-CH", dateOptions).split(" ")[1]}` : customTime ? `${date.toLocaleTimeString("fr-CH", dateOptions).split(" ")[0]} ${customTime}` : date.toLocaleDateString('fr-CH', dateOptions)

        let canvas = new Canvas(649, 423);
        let ctx = canvas.getContext("2d");

        let img = await loadImage('./src/resources/!template.png')
        ctx.drawImage(img, 0, 0, 649, 423)

        //JMÉNO
        let nameLength = 0;
        for (let i in name) {
            let symbol = name[i].match(/[A-Z]/) ? `_${name[i]}` : name[i] == " " ? "blank" : name[i]
            let symbolImg = await loadImage(`./src/resources/${symbol}.png`)
            ctx.drawImage(symbolImg, 167+nameLength, symbol == '0' ? 314 : 315)
            nameLength += symbolImg.width
        }

        //LEKCE
        let lekceLength = 0;
        for (let i in lekce) {
            let symbol = lekce[i]
            let lekceImg = await loadImage(`./src/resources/${symbol}.png`)
            ctx.drawImage(lekceImg, 167+lekceLength, symbol == '0' ? 150 : 151)
            lekceLength += lekceImg.width
        }

        //RYCHLOST
        let rychlostLength = 0;
        for (let i in rychlost) {
            let symbol = `${rychlost[i]}bold`
            let rychlostImg = await loadImage(`./src/resources/${symbol}.png`)
            ctx.drawImage(rychlostImg, 167+rychlostLength, 175)
            rychlostLength += rychlostImg.width
        }

        //CHYBOVOST
        let chybovostLength = 0;
        for (let i in chybovost) {
            let symbol = `${chybovost[i]}bold`
            let chybovostImg = await loadImage(`./src/resources/${symbol}.png`)
            ctx.drawImage(chybovostImg, 167+chybovostLength, 198)
            chybovostLength += chybovostImg.width
        }

        //CELKOVÝ ČAS
        let celkovyCasLength = 0;
        for (let i in celkovyCas) {
            let symbol = celkovyCas[i] == ':' ? 'dvojtecka' : celkovyCas[i]
            let celkovyCasImg = await loadImage(`./src/resources/${symbol}.png`)
            ctx.drawImage(celkovyCasImg, 167+celkovyCasLength, symbol == '0' ? 222 : 223)
            celkovyCasLength += celkovyCasImg.width
        }

        //ZNAKY
        let znakyLength = 0;
        for (let i in znaky) {
            let symbol = znaky[i]
            let znakyImg = await loadImage(`./src/resources/${symbol}.png`)
            ctx.drawImage(znakyImg, 167+znakyLength, symbol == '0' ? 246 : 247)
            znakyLength += znakyImg.width
        }

        //CHYBY
        let chybyLength = 0;
        for (let i in chyby) {
            let symbol = chyby[i]
            let chybyImg = await loadImage(`./src/resources/${symbol}.png`)
            ctx.drawImage(chybyImg, 167+chybyLength, symbol == '0' ? 269 : 270)
            chybyLength += chybyImg.width
        }

        //DATUM
        let datumLength = 0;
        for (let i in datum) {
            let symbol = datum[i] == ' ' ? 'blank' : datum[i] == ':' ? 'dvojtecka' : datum[i]
            let datumImg = await loadImage(`./src/resources/${symbol}.png`)
            ctx.drawImage(datumImg, 167+datumLength, symbol == '0' ? 290 : 291)
            datumLength += datumImg.width
        }

        //LIMIT CHYBOVOSTI
        let limitChybovostLength = 0;
        for (let i in limitChybovost) {
            let symbol = `${limitChybovost[i]}bold`
            let limitChybovostImg = await loadImage(`./src/resources/${symbol}.png`)
            ctx.drawImage(limitChybovostImg, 464+limitChybovostLength, 198)
            limitChybovostLength += limitChybovostImg.width
        }

        //LIMIT RYCHLOSTI
        let limitRychlostLength = 0;
        for (let i in limitRychlost) {
            let symbol = `${limitRychlost[i]}bold`
            let limitRychlostImg = await loadImage(`./src/resources/${symbol}.png`)
            ctx.drawImage(limitRychlostImg, 464+limitRychlostLength, 175)
            limitRychlostLength += limitRychlostImg.width
        }

        //CELKEM OPSÁNO
        let opsano = '100';
        let opsanoLength = 0;
        for (let i in opsano) {
            let symbol = opsano[i]
            let opsanoImg = await loadImage(`./src/resources/${symbol}.png`)
            ctx.drawImage(opsanoImg, 464+opsanoLength, symbol == '0' ? 246 : 247)
            opsanoLength += opsanoImg.width
        }
        
        if (!fs.existsSync('./FinalniObrazky/')) fs.mkdir(path.join(__dirname, '../FinalniObrazky'), (e) => {})
        let files = fs.readdirSync('./FinalniObrazky/').length

        await canvas.saveAs(`FinalniObrazky/${files+1}.png`)
        console.log('\x1b[0m')
        console.log('\x1b[30m\x1b[5m\x1b[42m')
        console.log(`\nObrázek byl vytvořen a uložen jako soubor pod názvem '${files+1}.png' ve složce 'FinalniObrazky'`)
        console.log('\x1b[0m')
        prompt()

        return
    } catch (e) {
        console.log('\x1b[0m')
        console.log('\x1b[41m')
        console.log(e)
        console.log('\x1b[0m')
        prompt()
    }
}
run()