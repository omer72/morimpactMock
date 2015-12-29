# morimpactMock

mongoimport --host localhost:3001 --db meteor --collection userPref --type csv  --drop --headerline --file userpref.csv
mongoexport --host localhost:3001 --db meteor --collection users --type csv --headerline --file users.csv
mongoimport --host localhost:3001 --db meteor --collection groups --type csv --drop --headerline --file group.csv
mongoimport --host localhost:3001 --db meteor --collection contributes --type csv  --drop --headerline --file contributes.csv
mongoimport --host localhost:3001 --db meteor --collection polite --type csv  --drop --headerline --file polite.csv
mongoimport --host localhost:3001 --db meteor --collection sales --type csv  --drop --headerline --file sales.csv
mongoimport --host localhost:3001 --db meteor --collection talks --type csv  --drop --headerline --file talks.csv
mongoimport --host localhost:3001 --db meteor --collection usersRecords  --type csv  --drop --headerline --file usersRecords.csv
