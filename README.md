# osu-m3u-creator

Создатель плейлиста из папки songs osu!

как использовать:

поменяйте на свой путь строку, где 	`var Songspath = 'F:\\Songs'`

обратные слеши в пути должны быть двойными - \\\\


поставьте node.js https://nodejs.org/en/download/


установите модули fs и m3u:

cd <путь к node js>
например `cd "c:\Program Files\nodejs"`

`npm install fs`
дождитесь окончания процесса

`npm install m3u`
дождитесь окончания процесса


если сделали все правильно запускайте батник из этого репозитория 
**osu-m3u-creator.bat**

появится полоска, по окончанию будет создан файл плейлиста **osu-playlist.m3u**
