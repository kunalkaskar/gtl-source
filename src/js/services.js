app
.constant('baseURL', 'http://localhost:8080/api/')        
.service('DashboardService', ['$http','baseURL', function ($http,baseURL) {
    this.getData = function (pageNumber, options) {
            var filters = {
                page : 1,
                minRating : 0,
                maxRating : 5,
                pageSize : 10,
                locationName : null,
                ulbName : null,
                sDate : null,
                eDate : null,
                download: false
            }
            angular.extend(filters, options);
            var endPoint;
            if(filters.download){
                endPoint = "download-report-of-locations";
            }else {
                endPoint = "get-report-of-locations";
            }
        return $http({
            method:'GET',
            url : baseURL+endPoint+"/"+filters.minRating+"/"+filters.maxRating+"/"+pageNumber+"/"+filters.pageSize,
            params : {
                locationType: filters.locationName,
                startDate : filters.sDate,
                endDate : filters.eDate,
                ulbName : filters.ulbName
            }
        })
        .then(function (response) {
                return response;
        }, function (error) {
            console.log(error);
        });
    }

    this.getNumbers = function(ulbName, isAdmin) {
        var ulb = ulbName || null;

        var url = isAdmin ? baseURL +'admin/get-dashboard' :baseURL +'get-dashboard';
        return $http({
            method:'GET',
            url : url,
            params: {
                ulbName : ulb
            }
        })
        .then(function(response) {
            return response;
        }, function(error) {
            console.log(error);
        });
    };


    this.getReviews = function(locationId,page,size ) {
        return $http({
            method: 'GET',
            url : baseURL+'get-reviews-of-location/'+locationId+'/'+page+'/'+size
        })
        .then(function(response) {
            return response;
        }, function(error) {
            console.log(error);
        });
    };

    this.getRatingData = function(ulbId) {
        return $http({
            method: 'GET',
            url : baseURL+'get-rating-counts-of-location/'+ulbId
        })
        .then(function(response) {
            return response;
        }, function(error) {
            console.log(error);
        });
    };

    this.downloadReport = function(filters) {
        var ulb = ulbName || null;
        return $http({
            method: 'GET',
            url : baseURL+'admin/get-dashboard', 
            params : {
                ulbName : ulb
            }
        })
        .then(function(response) {
            return response;
        }, function(error) {
            console.log(error);
        });
    };
}])
.service('MapService', [function() {
    this.drawMap = function(callBack) {
        var data = Highcharts.geojson(Highcharts.maps['countries/in/custom/in-all-disputed']);
        
        // Instanciate the map
        return Highcharts.mapChart('map', {
            chart: {
            },
            colors : ['#9900CC', '#9900CC'],
            title: {
                text: ''
            },
            legend:{
                enabled: false
            },
            subtitle: {
                text: '',
                floating: true,
                align: 'right',
                y: 50,
                style: {
                    fontSize: '16px'
                }
            },

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom',
                    align: 'right'
                }
            },

            plotOptions: {
                series: {
                    tooltip: {
                        headerFormat: '',
                        pointFormat: '{point.name}'
                    }
                }
            },

            series: [
                {
                    type:'map',
                    data : [{
                    name: "Delhi",
                    path: "M982,-367L977,-391,948,-471,945,-486,945,-505,937,-530,924,-560,768,-700,755,-749,727,-786,748,-834,718,-909,627,-875,616,-875,590,-883,565,-894,476,-920,458,-920,442,-902,431,-886,395,-855,332,-859,282,-842,235,-815,215,-796,202,-770,198,-747,197,-718,203,-604,200,-570,203,-555,216,-531,223,-505,206,-480,173,-449,166,-430,161,-386,150,-373,132,-368,97,-363,76,-354,66,-342,47,-304,6,-263,0,-244,3,-228,18,-209,47,-181,58,-168,66,-155,69,-142,71,-133,76,-112,144,-131,252,-141,281,-146,295,-152,297,-180,308,-197,319,-202,332,-200,463,-133,473,-121,479,-109,500,-46,508,-31,521,-15,547,4,592,30,623,51,703,80,765,69,784,58,794,48,795,37,790,24,779,8,766,-4,760,-18,766,-34,797,-63,827,-83,852,-92,965,-113,918,-209,906,-223,913,-255,921,-270,932,-283,961,-310,973,-321,981,-334,984,-349,982,-367"
                }]
                },
                {
                    type :'mappoint',
                    name: 'Delhi',
                    marker: {
                            "fillColor": "white",
                            "lineColor": "black",
                            "lineWidth": 1,
                            "radius": 3
                        },
                    data: [
                        {"name":'NDMC- North Delhi Municipal Corporation',"x":500, "y":-700, "total": 500, "star5": 445, "star3":342, 'ulbName': 'North DMC'},
                        {"name":'EDMC- East Delhi Municipal Corporation', "x":900, "y":-500, "total": 500, "star5": 445, "star3":342, 'ulbName': 'EDMC'},
                        {"name":'SDMC- South Delhi Municipal Corporation', "x":700, "y":-250, "total": 500, "star5": 445, "star3":342, 'ulbName': 'SDMC'},
                        {"name":'NDMC- New Delhi Municipal Council', "x":800, "y":-350, "total": 500, "star5": 445, "star3":342, 'ulbName': 'NDMC'},
                        {"name":'Delhi Cantonment', "x":500, "y":-300, "total": 500, "star5": 445, "star3":342, 'ulbName': 'DC'},
                        {"name":'Faridabad', "x":900, "y":-50, "total": 500, "star5": 445, "star3":342, 'ulbName': 'NDMC'},
                        {"name":'Ghaziabad/Noida', "x":1000, "y":-550, "total": 500, "star5": 445, "star3":342, 'ulbName': 'NDMC'},
                        {"name":'Gurugram', "x":310, "y":-50, "total": 500, "star5": 445, "star3":342, 'ulbName': 'MCG'}
                        ],
                   events : {
                    click : function(e) {
                        callBack(e.point.ulbName, true)
                    }
                   }
            }
            ],
            credits : {
                enabled:false
            }
        });
    }
}])
.service('ChartService', [function() {
    this.getPieChart = function(data) {
        console.log(data);
        return Highcharts.chart('pie-chart', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Ratings'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                name: 'share',
                colorByPoint: true,
                data: [{
                            name: '5 Stars',
                            y: data[5],
                            sliced: true,
                            selected: true
                        }, {
                            name: '4 Stars',
                            y: data[4]
                        }, {
                            name: '3 Stars',
                            y: data[3]
                        }, {
                            name: '2 Stars',
                            y: data[2]
                        }, {
                            name: '1 Stars',
                            y: data[1]
                        }]
            }],
            credits : {
                enabled: false
            }
        });
    }

    this.getBarGraph = function(categories, data) {
        return Highcharts.chart('lastSixDays', {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Last Six Days Ratings'
                    },
                    xAxis: {
                        categories:categories
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Stars rated'
                        }
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                        shared: true
                    },
                    plotOptions: {
                        column: {
                            stacking: 'percent'
                        }
                    },
                    series: data
                });
    }
}]);