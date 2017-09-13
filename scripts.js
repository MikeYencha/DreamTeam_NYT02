$(".dropdown-menu a").click(function() {
  $("#selected").text($(this).text());
});



// Added by Rolando
// I recommend creating functions separate and then adding
// them to the section below this way we don't overwrite each
// others code
$(document).ready(function() {
  addBtnEvent();


});

function addBtnEvent() {
  // below I'm adding the Search button click
  $(".btn-primary").on("click", function() {
    // transfering values from form to local variables
    var keyWord = $(".input-subject").val();
    var beginDate = $(".input-timeframe").val();
    var endDate = $(".input-timeframe").val();
    var rowCount = $(".dropdown-menu").val();
    // sending local variables to the newsFeed.getData ajax function
    newsFeed.getData(keyWord, beginDate, endDate, rowCount);
  });
  $(".dropdown-menu li").on('click', function() {
    newsFeed.count = parseInt($(this).text());
  });
}

newsFeed = {
  rawData: '', //this is where I catch the ajax raw data
  count: 5, //this is where I get the # of records->**id's preferred
  getData: function(keyWord, beginDate, endDate, count) {
    var queryOptions = {};
    queryOptions['api-key'] = "b2dde2ff614e4953a503afd7c8887f88";
    // newsFeed.count = count; if I can get li by id's this is what I would do
    // ternary operators to get query options for ajac call
    keyWord ? queryOptions['q'] = keyWord : '';
    beginDate ? queryOptions['begin_date'] = beginDate : '';
    endDate ? queryOptions['end_date'] = endDate : '';

    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url += '?' + $.param(queryOptions);
    $.ajax({
      url: url,
      method: 'GET',
    }).done(function(result) {
      newsFeed.rawData = result; //sends raw data from ajax to rawData variable
      newsFeed.renderData(); //calls the render function below
    }).fail(function(err) {
      throw err;
    });
  },
  renderData: function() {
    var newsArr = newsFeed.rawData.response.docs; //gets array of docs for raw data
    console.log(newsArr);
    var table = $("<table>");
    table.addClass("table table-bordered table-striped");
    table.append("<thead><th>Links</th></thead>");
    for (var i = 0; i < newsFeed.count; i++) {
      var row = $('<tr>');
      var link = $('<a>');
      link.prop("href", newsArr[i].web_url);
      link.text(newsArr[i].headline["main"]);
			link.attr('target', '_blank');
      row.append(link.append(link));
      table.append(row);
    }
    $("#content02").html(table);
  }
}
