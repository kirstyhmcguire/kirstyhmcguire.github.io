$("#submit").on("click", function() {
    var barcode = $("#barcode").val();
    console.log(barcode);
    httpGet(barcode);
    return false;
})

function httpGet(barcode) {
    console.log("in function");
    var xmlhttp = new XMLHttpRequest();
    var url = "https://world.openfoodfacts.org/api/v0/product/" + barcode + ".json";
    console.log(url);
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var pageObject = JSON.parse(this.responseText);
            if (pageObject.product) {
                var allergens = getAllergens(pageObject);
                //$('#barcodeForm').innerHtml = allergens.en
            } else {
                $('#previousBarcode').html("<h2>" + barcode + "</h2>");
                $('#previousAllergens').html("Unfortunately, our database does not yet include this product. We're working on it!");
            }
        }
    };
    
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    function getAllergens(pageObject) {
        var product = pageObject.product;
        
        var allergens = product.allergens.split(",");
        var allergensEnglish = [];
        
        for (var i = 0; i < allergens.length; i++) {
            var allergen = allergens[i];
            console.log(allergen);
            var found = false;
            for (var j = 0; j < allergensEnglish.length; j++) {
                if (allergensEnglish[j] === allergen.trim()) {
                    found = true;
                }
            }
            if (!found) {
                allergensEnglish.push(allergen.trim());
            }
        }
        /*
        console.log("allergens in function: " + allergens);
        var allergensSplit = allergens.split(":");
        var allergensEnglish = "";
        for (var i = 0; i < allergensSplit.length; i++) {
            console.log("element: " + allergensSplit[i]);
            if (allergensSplit[i] == "en") {
                var allergensRest = allergensSplit[i+1];
                var allergensRestSplit = allergensRest.split(";")
                allergensEnglish = allergensRestSplit[0];
            }
        }*/
        console.log("allergens in english: " + allergensEnglish);
        
        // set content of #previousBarcode to barcode
        if (product.product_name_en) {
            $('#previousBarcode').html("<h2>" + product.product_name_en + "</h2>");
        } else {
            $('#previousBarcode').html("<h2>" + barcode + "</h2>");
        }
        
        // set content of #preciousAllergens to allergensEnglish
        var allergensHtml = "";
        var currentAllergenHtml = "";
        for (var i = 0; i < allergensEnglish.length; i++) {
            currentAllergenHtml = "<li>" + allergensEnglish[i] + "</li>";
            allergensHtml += currentAllergenHtml;
        }
        
        $('#previousAllergens').html("<p>Allergens:</p><ul>" + allergensHtml + "</ul>");
        
        // use <ul>
        
        return allergensEnglish;
    }
};