const RequestUtils = require("../request-utils");

(async function() {
    const SERVER_PORT = 3000;
    let response = await RequestUtils.postJsonAsync(`http://localhost:${SERVER_PORT}/addOrder`, {
        name: "Ori Adijes",
        cellNumber: "+10545288989",
        address: "Arlozorov 7 Ramat Gan",
        orderTitle: "Make it Fast - Ori Adijes!",
        orderAddress: "HaBarzel St 1, Tel Aviv-Yafo"
    });

    console.log(`addOrder status code: ${response.statusCode}`);
    const responseBody = response.body;
    console.log(`addOrder response body:`, responseBody);

    const customerPhone = responseBody.customer.phone;
    response = await RequestUtils.getJsonAsync(`http://localhost:${SERVER_PORT}/orders/${customerPhone}`);
    console.log(`orders request status code: ${response.statusCode}`);
    console.log(`orders response body:`, response.body);
})().catch(function(error) {
    console.log("Error Occurred", error);
});