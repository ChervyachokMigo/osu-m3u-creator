var log = console.log.bind(console)
var fs = require('fs').promises
var writer = require('m3u').writer();
var path = require('path')

var progressbar, progressbar_empty

function ProgressBarDefault(){
	progressbar = ""
	progressbar_empty = "__________"
}

function PrintProcents(procent){

	if ((procent*10 % 100) < 1){
		progressbar_empty = progressbar_empty.substring(0, progressbar_empty.length - 1);
		progressbar = progressbar + "█"
	}
	log ("╔══════════╗")
	log ("║"+progressbar+progressbar_empty+"║")
	log ("╚══════════╝")
	log (procent + "% ")
}

function PrintProgress(Length,num,task){
	if (num % (Length/1000) < 1 ){
		process.stdout.write('\033c');
		let itemnumproc = Math.trunc(num / Length * 1000) / 10
		log ("[Tasks]")
		log("Check all audios")
		log ("")
		log ("Processing...")
		PrintProcents(itemnumproc)
	}
}

var osu_m3u_creator = {

run: async function(){
	var Songspath= 'F:\\Songs'
	var SongsDir
	try{
	  	SongsDir = await fs.readdir(Songspath);
	}catch(errorSongsPath){
		if (errorSongsPath.code === 'ENOENT'){
			log ("Incorrect path to Songs")
		}
		return
	}

	var itemnum = 0
	ProgressBarDefault()

	for (const folder of SongsDir){
		let filePathTemp = (Songspath+'\\'+folder).replace(/\/+/g, '\\').replace(/\\+/g, '\\')
	 	let fileTemp = await fs.lstat(filePathTemp)

	 	PrintProgress(SongsDir.length,itemnum,1)
		itemnum++

		if (fileTemp.isDirectory()){
			let DirTemp = await fs.readdir(filePathTemp)
			for (let checkingfile of DirTemp){
				if (path.extname(checkingfile)=='.osu'){
					let tempdata = await fs.readFile((filePathTemp+"\\"+checkingfile).replace(/\/+/g, '\\').replace(/\\+/g, '\\'),'utf8')
	   				tempdata = tempdata.toString().split("\n")
				   	for(let i in tempdata) {
						if(tempdata[i].startsWith("AudioFilename:") ){
							tempdata_beatmapAudio = tempdata[i].split(":")
							tempdata_beatmapAudio =  tempdata_beatmapAudio[1].trim()
							let beatmapAudioPath = filePathTemp+"\\"+tempdata_beatmapAudio
							try {
								let fileTemp = await fs.lstat(beatmapAudioPath)
								writer.file(beatmapAudioPath);
							} catch(e){
								log (e)
							}
						}
					}
	   			}
			}
		}
	}


	writer = writer.toString().split('\n')
	writer = writer.filter(onlyUnique);
	writer = writer.join('\n')
	await fs.writeFile('osu-playlist.m3u', writer)

}}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

main = async function(){
		return (await osu_m3u_creator.run())
}
main()