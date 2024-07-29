const axios = require('axios');


axios.get('http://127.0.0.1:8000/providers/')
          .then(response => {
            console.log(response.data);
          })
          .catch(error => {
            console.log("Fallo por ", error);
          });