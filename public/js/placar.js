
$("#botao-sync").click(sincronizaPlacar);
function inserePlacar() {
    var corpoTabela = $(".placar").find("tbody");
    var usuario = $("#usuarios").val();
    var numPalavras = $("#contador-palavras").text();

    var linha = novaLinha(usuario, numPalavras);
    linha.find(".botao-remover").click(removeLinha);

    corpoTabela.append(linha);
    $(".placar").slideDown(500);
    scrollPlacar();
}

function novaLinha(usuario, palavras) {
    var linha = $("<tr>");
    var colunaUsuario = $("<td>").text(usuario);
    var colunaPalavras = $("<td>").text(palavras);
    var colunaRemover = $("<td>");

    var link = $("<a>").addClass("botao-remover").attr("href", "#");
    var icone = $("<i>").addClass("small").addClass("material-icons").text("delete");

    link.append(icone);

    colunaRemover.append(link);

    linha.append(colunaUsuario);
    linha.append(colunaPalavras);
    linha.append(colunaRemover);

    return linha;
}

function removeLinha() {
    event.preventDefault();
    $(this).parent().parent().fadeOut(1000);
    setTimeout(function () {
        $(this).parent().parent().remove();
    }, 1000)
}

$("#botao-placar").click(mostraPlacar);

function mostraPlacar() {
    $(".placar").stop().slideToggle(600);
}

function scrollPlacar() {
    $("body").animate(
        {
            scrollTop: $(".placar").offset().top + "px"
        }, 1000);
}

function sincronizaPlacar() {
    var placar = [];
    var linhas = $("tbody>tr");
    linhas.each(function () {
        var usuario = $(this).find("td:nth-child(1)").text();
        var palavras = $(this).find("td:nth-child(2)").text();
        var score = {
            usuario: usuario,
            pontos: palavras
        };
        placar.push(score);
    })
    var dados = {
        placar: placar
    }
    $.post("http://localhost:3000/Placar", dados, function () {
        console.log("Salvou os dados no placar");
        $(".tooltip").tooltipster("open");
    }).fail(function () {
        $(".tooltip").tooltipster("open").tooltipster("content", "Falha ao salvar os dados no BD");
    })
        .always(function () {
            setTimeout(function () {
                $(".tooltip").tooltipster("close");
            }, 1200)
        })
}

function atualizaPlacar() {
    $.get("http://localhost:3000/Placar", function (data) {
        $(data).each(function () {
            var linha = novaLinha(this.usuario, this.pontos);
            linha.find(".botao-remover").click(removeLinha);
            $("tbody").append(linha);
        })
    })
}