curl http://localhost:3000/addOrder --request POST -H "Content-Type: application/json" --data "{\"name\":\"Ori Adijes\",\"cellNumber\":\"+10544889999\",\"address\":\"Arlozorov 7 Ramat Gan\", \"orderTitle\":\"Make it Fast - CURL Ori Adijes!\",\"orderAddress\": \"HaBarzel St 1, Tel Aviv-Yafo\"}"

curl http://localhost:3000/orders/+10544889999 --request GET