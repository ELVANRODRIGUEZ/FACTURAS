// ===================================================================== XMLAPI and DOMParser

function grabElements() {

    dataArea = document.getElementById("dataHolder");
    var files = document.getElementById("pickedFile");
    files.addEventListener("change", process, false);

};

function process(element) {

    // Assign "files" the selected file in the input file selector.
    var files = element.target.files;
    // Since "element.target.files" returns an array, we will choose the firs one of its elements.
    var filesSelected = Object.keys(files).length;

    for (var i = 0; i < filesSelected; i++) {
        var pickedFile = files[i];
        // The "FileReader" type assigned to a variable creates the object for subsequent usage.
        var Reader = new FileReader();

        // Once created, the "FileReader" object named "Reader" will read "as text" whatever file was chosen.
        Reader.readAsText(pickedFile);

        // We'll add an event listener for "load" action to the Reader object to call the "broadcast" function.
        Reader.addEventListener("load", findXMLElements, false);

    }
};

function findXMLElements(element) {

    // By passing the argument "element" (this name could be any name) to the function, we are capturing the element that called this function, which was the "Reader object" created in the "process" function. Then we can retrieve its properties and methods. In this case, we are assigning the "Reader objet" read as text file to the variable "response".
    var response = element.target.result;

    // Creating a new "DOMParser" object by assigning the "DOMParser" type to a variable.
    var parser = new DOMParser();
    // Assign the parsed result, which swaped the text content of "response" for an XML structured object.
    var xmlDoc2 = parser.parseFromString(response, "text/xml");

    var rfcEmisor;
    var nombreEmisor;
    var fecha;
    var claveCFDI;
    var subtotalComprobante;
    var totalComprobante;
    var totalIVA;
    var metodoPagoComprobante;
    var formaPagoComprobante;
    var totalImpTrasImpuestos;

    // We'll search for the "cfdi:Emisor" through the "getElementsByTagName" method which retrieves an array, so we will take the first one of its elements.
    tagEmisor = xmlDoc2.getElementsByTagName("cfdi:Emisor")[0];
    // The following searches will take place only if there actually was a "cfdi:Emisor" tag. If there was, the following attributes will be searched within it.
    if (tagEmisor != undefined) {

        // This if checks the spelling for the "RFC" attribute. Former invoices had a different sepelling from what they have today.
        if (tagEmisor.getAttribute("rfc") != undefined) {
            rfcEmisor = tagEmisor.getAttribute("rfc");
        } else {
            rfcEmisor = tagEmisor.getAttribute("Rfc");
        };
        // This if checks the spelling for the "NOMBRE" attribute. Former invoices had a different sepelling from what they have today.
        if (tagEmisor.getAttribute("nombre") != undefined) {
            nombreEmisor = tagEmisor.getAttribute("nombre");
        } else {
            nombreEmisor = tagEmisor.getAttribute("Nombre");
        };

    };

    tagTimbre = xmlDoc2.getElementsByTagName("tfd:TimbreFiscalDigital")[0];
    if (tagTimbre != undefined) {
        claveCFDI = tagTimbre.getAttribute("UUID");

    }

    tagComprobante = xmlDoc2.getElementsByTagName("cfdi:Comprobante")[0];
    if (tagComprobante != undefined) {

        if (tagComprobante.getAttribute("Fecha") != undefined) {
            fecha = tagComprobante.getAttribute("Fecha");
        } else {
            fecha = tagComprobante.getAttribute("fecha");
        };

        if (tagComprobante.getAttribute("subTotal") != undefined) {
            subtotalComprobante = tagComprobante.getAttribute("subTotal");
        } else {
            subtotalComprobante = tagComprobante.getAttribute("SubTotal");
        };

        if (tagComprobante.getAttribute("total") != undefined) {
            totalComprobante = tagComprobante.getAttribute("total");
        } else {
            totalComprobante = tagComprobante.getAttribute("Total");
        };

        if (tagComprobante.getAttribute("metodoDePago") != undefined) {
            metodoPagoComprobante = tagComprobante.getAttribute("metodoDePago");
        } else {
            metodoPagoComprobante = tagComprobante.getAttribute("MetodoPago");
        };

        if (tagComprobante.getAttribute("formaDePago") != undefined) {
            formaPagoComprobante = tagComprobante.getAttribute("formaDePago");
        } else {
            formaPagoComprobante = tagComprobante.getAttribute("FormaPago");
        };

        subtotalComprobante = formatCurrency(subtotalComprobante);
        totalComprobante = formatCurrency(totalComprobante);
        fecha = formatTime(fecha);

    }


    impTagPresent = xmlDoc2.getElementsByTagName("cfdi:Impuestos").length;

    rigthImpTag = xmlDoc2.getElementsByTagName("cfdi:Impuestos")[impTagPresent - 1];

    if (rigthImpTag != undefined) {

        if (rigthImpTag.getAttribute("totalImpuestosTrasladados") != undefined) {
            totalImpTrasImpuestos = rigthImpTag.getAttribute("totalImpuestosTrasladados");
        } else {
            totalImpTrasImpuestos = rigthImpTag.getAttribute("TotalImpuestosTrasladados");
        };

        totalImpTrasImpuestos = formatCurrency(totalImpTrasImpuestos);

    }

    tagImpuestosTras = rigthImpTag.getElementsByTagName("cfdi:Traslados")[0];

    if (tagImpuestosTras != undefined) {
        impuestosTrasCount = tagImpuestosTras.children.length;

        totalIVA = 0;

        for (var i = 0; i < impuestosTrasCount; i++) {
            var impTipo;
            var impTrasladadoImp;
            var impTrasladado;

            impTrasladado = tagImpuestosTras.getElementsByTagName("cfdi:Traslado")[i];
            impTipo = impTrasladado.getAttribute("Impuesto");
            impTrasladadoImp = parseFloat(impTrasladado.getAttribute("Importe"));


            if (!impTipo) {
                impTipo = impTrasladado.getAttribute("impuesto");
                console.log("impuesto");
            }
            if (!impTrasladadoImp) {
                impTrasladadoImp = parseFloat(impTrasladado.getAttribute("importe"));
                console.log("importe");
            }


            if (impTipo == "002" || impTipo == "IVA") {
                totalIVA = totalIVA + impTrasladadoImp;

            }

        }

        totalIVA = formatCurrency(totalIVA);

        if (totalIVA > totalImpTrasImpuestos) {
            totalIVA = totalImpTrasImpuestos
        } 

    } else {
        totalIVA = formatCurrency(0);

    }


    $(".table > tbody").append(
        "<tr>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td>" + nombreEmisor + "</td>" +
        "<td>" + rfcEmisor + "</td>" +
        "<td>" + fecha + "</td>" +
        "<td>" + claveCFDI + "</td>" +
        "<td></td>" +
        "<td>" + totalComprobante + "</td>" +
        "<td>" + totalIVA + "</td>" +
        "<td>" + totalImpTrasImpuestos + "</td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td>" + formaPagoComprobante + "</td>" +
        "<td></td>" +
        "</tr>"
    );

}


// ========================================== EVENTS
// To load the first of the functions once the window is loaded.

window.addEventListener("load", grabElements, false);


// ========================================== FUNCTIONS

function formatCurrency(number) {
    number = numeral(number).format("$0,0.00");
    return number;
}

function formatTime(time) {
    time = moment(time).format("MM/DD/YYYY");
    return time;
}