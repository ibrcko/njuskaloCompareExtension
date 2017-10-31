window.onload = function () {
    chrome.tabs.getSelected(null, function (tab) {
        chrome.tabs.sendMessage(tab.id, {type: "poruka"});

    });


    document.getElementById('formToggle').addEventListener('click', hideShow);

    modelIdentifier();
    document.getElementById('filter').addEventListener('click', queryCreate);

};

chrome.extension.onMessage.addListener(function (message) {
    if (message.type != 'poruka') {

        queryScraper = message.query;

        getAndCreate(queryScraper);

    }

});

function getAndCreate(query) {

    polje = [];

    $.ajax({
        url: 'https://evening-journey-37500.herokuapp.com/njuskaloScraper?query=' + query,
        method: 'GET'
    }).then(function (data) {
        data.forEach(function (element) {
            polje.push(element);
        });

        if(polje === null){
            offerCount = document.getElementById('offerCount');
            offerCount.innerHTML = "Nismo pronašli oglase koji odgovaraju vašim kriterijima";
        } else{
        polje.sort(function (a, b) {
            if (a.price > b.price) return 1;
            if (a.price < b.price) return -1;
            else return 0;
        });

        polje.forEach(function (element) {
            container = document.getElementById('cont');

            offerCount = document.getElementById('offerCount');
            offerCount.innerHTML = "Pronašli smo " + data.length + " sličnih oglasa za Vas:";

            divOffer = document.createElement('a');
            divOffer.classList.add('divA');
            divOffer.setAttribute('href', element.url);
            divOffer.setAttribute('target', '_blank');
            container.appendChild(divOffer);

            divImg = document.createElement('div');
            divImg.classList.add('divImg');
            divOffer.appendChild(divImg);

            Img = document.createElement('img');
            Img.classList.add('imgSlika');
            Img.setAttribute('src', 'http:' + element.imgUrl);
            divImg.appendChild(Img);

            divDetails = document.createElement('div');
            divDetails.classList.add('offDetails');
            divOffer.appendChild(divDetails);

            h1 = document.createElement('h1');
            h1.innerHTML = element.title;
            h1.classList.add('offHeading');
            divDetails.appendChild(h1);

            p1 = document.createElement('p');
            p1.innerHTML = element.price;
            p1.classList.add('offP1');
            divDetails.appendChild(p1);

            p2 = document.createElement('p');
            p2.innerHTML = element.description;
            p2.classList.add('offP2');
            divDetails.appendChild(p2);

        })
    }});

}

function getAndCreateFilter(query) {

    container = document.getElementById('cont');
    offerCount = document.getElementById('offerCount');
    container.innerHTML = '';
    offerCount.innerHTML = '';

    polje = [];


    $.ajax({
        url: 'https://evening-journey-37500.herokuapp.com/njuskaloFilter?query=' + query,
        method: 'GET'
    }).then(function (data) {
        data.forEach(function (element) {
            polje.push(element);
        });

        if(data.length == 0){
            offerCount = document.getElementById('offerCount');
            offerCount.innerHTML = "Nismo pronašli oglase koji odgovaraju vašim kriterijima";
        } else{
        polje.sort(function (a, b) {
            if (a.price > b.price) return 1;
            if (a.price < b.price) return -1;
            else return 0;
        });

        polje.forEach(function (element) {
            container = document.getElementById('cont');

            offerCount = document.getElementById('offerCount');
            offerCount.innerHTML = "Pronašli smo " + data.length + " sličnih oglasa za Vas:";

            divOffer = document.createElement('a');
            divOffer.classList.add('divA');
            divOffer.setAttribute('href', element.url);
            divOffer.setAttribute('target', '_blank');
            container.appendChild(divOffer);

            divImg = document.createElement('div');
            divImg.classList.add('divImg');
            divOffer.appendChild(divImg);

            Img = document.createElement('img');
            Img.classList.add('imgSlika');
            Img.setAttribute('src', 'http:' + element.imgUrl);
            divImg.appendChild(Img);

            divDetails = document.createElement('div');
            divDetails.classList.add('offDetails');
            divOffer.appendChild(divDetails);

            h1 = document.createElement('h1');
            h1.innerHTML = element.title;
            h1.classList.add('offHeading');
            divDetails.appendChild(h1);

            p1 = document.createElement('p');
            p1.innerHTML = element.price;
            p1.classList.add('offP1');
            divDetails.appendChild(p1);

            p2 = document.createElement('p');
            p2.innerHTML = element.description;
            p2.classList.add('offP2');
            divDetails.appendChild(p2);

        })
        }});

}

function hideShow(){
    form = document.getElementById('form');

    form.classList.toggle('formHide');
}


function modelIdentifier() {
    $("#model_lvl_0").change(function () {

        var target = $(this).children('option:selected').data('target');

        $('#model_lvl_1 option').each(function (index, option) {
            option.hidden = true;
            option.selected = false;
        })

        $("#model_lvl_1").find("." + target).each(function (index, option) {
            if (option.hidden == true) {
                option.hidden = false;
            }
        })
    });
}
//FILTERI:
function queryCreate() {

    queryFilter = '';


    //kategorija
    categoryId = document.getElementById('categoryId');
    categoryIdQuery = categoryId.options[categoryId.selectedIndex].value + '?';

    queryFilter = queryFilter + categoryIdQuery;

    //model

    model_lvl_0 = document.getElementById('model_lvl_0');
    model_lvl_1 = document.getElementById('model_lvl_1');

    if (model_lvl_1.options[model_lvl_1.selectedIndex].value == "") {
        modelIdQuery = 'modelId=' + model_lvl_0.options[model_lvl_0.selectedIndex].value;
    }
    else {
        modelIdQuery = 'modelId=' + model_lvl_1.options[model_lvl_1.selectedIndex].value;
    }

    queryFilter = queryFilter + modelIdQuery;


    //cijena min i max
    priceMin = document.getElementById('priceMin');
    priceMinQuery = '&price%5Bmin%5D=' + priceMin.value;

    priceMax = document.getElementById('priceMax');
    priceMaxQuery = '&price%5Bmax%5D=' + priceMax.value;

    queryFilter = queryFilter + priceMinQuery + priceMaxQuery;


    //krajnja cijena u kunama
    onlyFullPrice = document.getElementById('onlyFullPrice');
    if (onlyFullPrice.checked)
        onlyFullPriceQuery = '&onlyFullPrice=1';
    else
        onlyFullPriceQuery = '';

    queryFilter = queryFilter + onlyFullPriceQuery;

    //lokacija vozila
    locationId = document.getElementById('locationId');
    locationIdQuery = '&locationId=' + locationId.options[locationId.selectedIndex].value;

    queryFilter = queryFilter + locationIdQuery;

    //godina proizvodnje min i max
    yearManufacturedMin = document.getElementById('yearManufacturedMin');
    yearManufacturedMinQuery = '&yearManufactured%5Bmin%5D=' + yearManufacturedMin.options[yearManufacturedMin.selectedIndex].value;

    yearManufacturedMax = document.getElementById('yearManufacturedMax');
    yearManufacturedMaxQuery = '&yearManufactured%5Bmax%5D=' + yearManufacturedMax.options[yearManufacturedMax.selectedIndex].value;

    queryFilter = queryFilter + yearManufacturedMaxQuery + yearManufacturedMinQuery;

    //stanje vozila
    var condition1Query = '';
    var condition2Query = '';
    var condition3Query = '';

    condition1 = document.getElementById('condition1');
    if (condition1.checked)
        condition1Query = '&condition%5Bnew%5D=1';
    else
        condition1Query = '';

    condition2 = document.getElementById('condition2');
    if (condition2.checked)
        condition2Query = '&condition%5Bused%5D=1';
    else
        condition2Query = '';

    condition3 = document.getElementById('condition3');
    if (condition3.checked)
        condition3Query = '&condition%5Btest%5D=1';
    else
        condition3Query = '';

    queryFilter = queryFilter + condition1Query + condition2Query + condition3Query;

    //samo oglasi sa slikom
    adsWithImages = document.getElementById('adsWithImages');
    if (adsWithImages.checked)
        adsWithImagesQuery = '&adsWithImages=1';
    else
        adsWithImagesQuery = '';

    queryFilter = queryFilter + adsWithImagesQuery;

    //oblik karoserije
    bodyType = document.getElementById('bodyType');
    bodyTypeQuery = '&bodyTypeId=' + bodyType.options[bodyType.selectedIndex].value;

    queryFilter = queryFilter + bodyTypeQuery;

    //tip motora
    fuelType = document.getElementById('fuelType');
    fuelTypeQuery = '&fuelTypeId=' + fuelType.options[fuelType.selectedIndex].value;

    queryFilter = queryFilter + fuelTypeQuery;

    //plin
    fuelHasLpg = document.getElementById('fuelHasLpg');
    fuelHasLpgQuery = '&fuelHasLpg=' + fuelHasLpg.options[fuelHasLpg.selectedIndex].value;

    queryFilter = queryFilter + fuelHasLpgQuery;

    //obujam motora min i max
    motorSizeMin = document.getElementById('motorSizeMin');
    motorSizeMinQuery = '&motorSize%5Bmin%5D=' + motorSizeMin.value;

    motorSizeMax = document.getElementById('motorSizeMax');
    motorSizeMaxQuery = '&motorSize%5Bmax%5D=' + motorSizeMax.value;

    queryFilter = queryFilter + motorSizeMinQuery + motorSizeMaxQuery;


    //snaga motora min i max
    motorPowerMin = document.getElementById('motorPowerMin');
    motorPowerMinQuery = '&motorPower%5Bmin%5D=' + motorPowerMin.value;

    motorPowerMax = document.getElementById('motorPowerMax');
    motorPowerMaxQuery = '&motorPower%5Bmax%5D=' + motorPowerMax.value;

    queryFilter = queryFilter + motorPowerMinQuery + motorPowerMaxQuery;

    //pogon
    driveType = document.getElementById('driveType');
    driveTypeQuery = '&driveTypeId=' + driveType.options[driveType.selectedIndex].value;

    queryFilter = queryFilter + driveTypeQuery;

    //kilometraža
    mileageMin = document.getElementById('mileageMin');
    mileageMinQuery = '&mileage%5Bmin%5D=' + mileageMin.value;

    mileageMax = document.getElementById('mileageMax');
    mileageMaxQuery = '&mileage%5Bmax%5D=' + mileageMax.value;

    queryFilter = queryFilter + mileageMinQuery + mileageMaxQuery;

    //klima uređaj
    airConditionType = document.getElementById('airConditionType');
    airConditionTypeQuery = '&airConditionTypeId=' + airConditionType.options[airConditionType.selectedIndex].value;

    queryFilter = queryFilter + airConditionTypeQuery;

    //vrsta prijenosa
    var transmissionType1Query = '';
    var transmissionType2Query = '';
    var transmissionType3Query = '';
    var transmissionType4Query = '';

    transmissionType1 = document.getElementById('transmissionType1');
    if (transmissionType1.checked)
        transmissionType1Query = '&transmissionTypeId%5B610%5D=610';
    else
        transmissionType1Query = '';

    transmissionType2 = document.getElementById('transmissionType2');
    if (transmissionType2.checked)
        transmissionType2Query = '&transmissionTypeId%5B611%5D=611';
    else
        transmissionType2Query = '';

    transmissionType3 = document.getElementById('transmissionType3');
    if (transmissionType3.checked)
        transmissionType3Query = '&transmissionTypeId%5B612%5D=612';
    else
        transmissionType3Query = '';

    transmissionType4 = document.getElementById('transmissionType4');
    if (transmissionType4.checked)
        transmissionType4Query = '&transmissionTypeId%5B613%5D=613';
    else
        transmissionType4Query = '';

    queryFilter = queryFilter + transmissionType1Query + transmissionType2Query + transmissionType3Query + transmissionType4Query;

    //potrošnja goriva
    fuelConsumptionMin = document.getElementById('fuelConsumptionMin');
    fuelConsumptionMinQuery = '&fuelConsumption%5Bmin%5D=' + fuelConsumptionMin.value;

    fuelConsumptionMax = document.getElementById('fuelConsumptionMax');
    fuelConsumptionMaxQuery = '&fuelConsumption%5Bmax%5D=' + fuelConsumptionMax.value;

    queryFilter = queryFilter + fuelConsumptionMinQuery + fuelConsumptionMaxQuery;

    //emisija co2
    co2EmissionMin = document.getElementById('co2EmissionMin');
    co2EmissionMinQuery = '&co2Emission%5Bmin%5D=' + co2EmissionMin.value;

    co2EmissionMax = document.getElementById('co2EmissionMax');
    co2EmissionMaxQuery = '&co2Emission%5Bmax%5D=' + co2EmissionMax.value;

    queryFilter = queryFilter + co2EmissionMinQuery + co2EmissionMaxQuery;

    //ekološka kategorija
    ecologyType = document.getElementById('ecologyType');
    ecologyTypeQuery = '&ecologyTypeId=' + ecologyType.options[ecologyType.selectedIndex].value;

    queryFilter = queryFilter + ecologyTypeQuery;

    //broj vrata
    doorCount = document.getElementById('doorCount');
    doorCountQuery = '&doorCountId=' + doorCount.options[doorCount.selectedIndex].value;

    queryFilter = queryFilter + doorCountQuery;

    //broj sjedala
    seatCount = document.getElementById('seatCount');
    seatCountQuery = '&seatCountId=' + seatCount.options[seatCount.selectedIndex].value;

    queryFilter = queryFilter + seatCountQuery;

    //broj brzina
    gearNumber = document.getElementById('gearNumber');
    gearNumberQuery = '&gearNumberId=' + gearNumber.options[gearNumber.selectedIndex].value;

    queryFilter = queryFilter + gearNumberQuery;

    //boja
    colorId = document.getElementById('colorId');
    colorIdQuery = '&colorId=' + colorId.options[colorId.selectedIndex].value;

    queryFilter = queryFilter + colorIdQuery;

    //istek registracije
    registrationExpiryTs = document.getElementById('registrationExpiryTs');
    registrationExpiryTsQuery = '&registrationExpiryTs=' + registrationExpiryTs.options[registrationExpiryTs.selectedIndex].value;

    queryFilter = queryFilter + registrationExpiryTsQuery;

    //vlasnik
    ownerCount = document.getElementById('ownerCount');
    ownerCountQuery = '&ownerCountId=' + ownerCount.options[ownerCount.selectedIndex].value;

    queryFilter = queryFilter + ownerCountQuery;

    //zračni jastuci
    var airbagType1Query = '';
    var airbagType2Query = '';
    var airbagType3Query = '';

    airbagType1 = document.getElementById('airbagType1');
    if (airbagType1.checked)
        airbagType1Query = '&airbagTypeId%5B61%5D=61';
    else
        airbagType1Query = '';

    airbagType2 = document.getElementById('airbagType2');
    if (airbagType2.checked)
        airbagType2Query = '&airbagTypeId%5B62%5D=62';
    else
        airbagType2Query = '';

    airbagType3 = document.getElementById('airbagType3');
    if (airbagType3.checked)
        airbagType3Query = '&airbagTypeId%5B63%5D=63';
    else
        airbagType3Query = '';

    queryFilter = queryFilter + airbagType1Query + airbagType2Query + airbagType3Query;

    //radio
    radioType = document.getElementById('radioType');
    radioTypeQuery = '&radioTypeId=' + radioType.options[radioType.selectedIndex].value;

    queryFilter = queryFilter + radioTypeQuery;

    //načini plaćanja
    var paymentOptions1Query = '';
    var paymentOptions2Query = '';
    var paymentOptions3Query = '';
    var paymentOptions4Query = '';
    var paymentOptions5Query = '';
    var paymentOptions6Query = '';
    var paymentOptions7Query = '';

    paymentOptions1 = document.getElementById('paymentOptions1');
    if (paymentOptions1.checked)
        paymentOptions1Query = '&paymentOptions%5B12%5D=12';
    else
        paymentOptions1Query = '';

    paymentOptions2 = document.getElementById('paymentOptions2');
    if (paymentOptions2.checked)
        paymentOptions2Query = '&paymentOptions%5B14%5D=14';
    else
        paymentOptions2Query = '';

    paymentOptions3 = document.getElementById('paymentOptions3');
    if (paymentOptions3.checked)
        paymentOptions3Query = '&paymentOptions%5B15%5D=15';
    else
        paymentOptions3Query = '';

    paymentOptions4 = document.getElementById('paymentOptions4');
    if (paymentOptions4.checked)
        paymentOptions4Query = '&paymentOptions%5B92%5D=92';
    else
        paymentOptions4Query = '';

    paymentOptions5 = document.getElementById('paymentOptions5');
    if (paymentOptions5.checked)
        paymentOptions5Query = '&paymentOptions%5B341%5D=341';
    else
        paymentOptions5Query = '';

    paymentOptions6 = document.getElementById('paymentOptions6');
    if (paymentOptions6.checked)
        paymentOptions6Query = '&paymentOptions%5B342%5D=342';
    else
        paymentOptions6Query = '';

    paymentOptions7 = document.getElementById('paymentOptions7');
    if (paymentOptions7.checked)
        paymentOptions7Query = '&paymentOptions%5B343%5D=343';
    else
        paymentOptions7Query = '';


    queryFilter = queryFilter + paymentOptions1Query + paymentOptions2Query + paymentOptions3Query + paymentOptions4Query + paymentOptions5Query
        + paymentOptions6Query + paymentOptions7Query;

    getAndCreateFilter(queryFilter);

    hideShow();
}