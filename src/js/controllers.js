app.controller('dashboardController', ['$scope', 'DashboardService', '$filter', 'MapService', 'ChartService', 'baseURL','NgMap','$timeout', function ($scope, DashboardService, $filter, MapService, ChartService, baseURL, NgMap, $timeout) {
    $scope.locationData;
    $scope.currentPage = 1;
    $scope.totalPages = 496;
    $scope.isAdmin = false;
    $scope.filters = {};

    $scope.showDetails = false;

    $scope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyD304cZovgQsVQt2vaAILBdD3bD5pFHcx0";
    $scope.ulbCords = {
        "NorthDMC": [28.6579034, 77.18296599999999],
        "EDMC": [28.6387104, 77.30824489999999],
        "SDMC": [28.5730519, 77.17353390000001],
        "NDMC": [28.6281286, 77.2155348],
        "DC": [28.628716, 77.162609],
        "MCG": [28.4594965, 77.0266383]

    }
    $scope.markerPosition = [28.7040592, 77.10249019999999];
    $scope.gmap = false;

    $scope.latcenter = 28.7040592;
    $scope.longcenter = 77.10249019999999;

    $scope.filterModel = {
        ratings : [0, 5],
        min : 0,
        max : 5,
        ward : $scope.selectedUlb != 'All Wards' ? $scope.selectedUlb : '',
        type : '',
        period: '',
        fromDate : '',
        toDate : ''
    };

    $scope.getData = function(pageNumber) {
    	if (pageNumber < 1 || pageNumber > $scope.totalPages) {
            return;
        };
        
        $scope.currentPage = pageNumber;
        DashboardService.getData(pageNumber, $scope.filters).then(function(result) {
            $scope.metaData = result.data;
            $scope.totalPages = Math.ceil($scope.metaData.noOfElements/10);
            $scope.locationData = JSON.parse($scope.metaData.content);
            $scope.pages = $scope.getPages(pageNumber, $scope.totalPages);
            console.log(result.data);
        });
    };

    $scope.getNumbers = function(ulbName, showMap) {
        console.log(ulbName);
        //if(!$scope.isAdmin){
            if(showMap){
                $scope.gmap = showMap;
                $scope.arrayUlbName = ulbName.replace(/[\s]/g, '');
                $scope.selectedCenter = $scope.ulbCords[$scope.arrayUlbName];
                
                NgMap.getMap().then(function(map) {
                    /*console.log(map.getCenter());
                    console.log('markers', map.markers);
                    console.log('shapes', map.shapes);*/
                  
                    //var center = {lat:$scope.latcenter, lng: $scope.longcenter};
                    //console.log(center);
                    $timeout(function() {
                        google.maps.event.trigger(map, "resize");
                        $scope.latcenter = $scope.selectedCenter[0];
                        $scope.longcenter = $scope.selectedCenter[1];
                        $scope.$apply();
                    }, 500)
                    
                     
                     //map.setCenter(center);
                 });
            }
    	   DashboardService.getNumbers(ulbName, $scope.isAdmin).then(function(result) {
    		
        		$scope.dashboardNumbers = result.data;
                $scope.totalToilets = {
                    myValue : 0,
                    myTarget : parseInt($scope.dashboardNumbers.totalToilets) || 1000,
                    myDuration : 2000,
                    myEffect : 'linear'
                }
                //console.log(parseInt($scope.dashboardNumbers.totalToilets));

                $scope.fiveStarsRated = {
                    myValue : 0,
                    myTarget : parseInt($scope.dashboardNumbers.fiveStarsRated) || 1000,
                    myDuration : 2000,
                    myEffect : 'linear'
                }

                $scope.threeOrLessStarsRated = {
                    myValue : 0,
                    myTarget : parseInt($scope.dashboardNumbers.threeOrLessStarsRated) || 1000,
                    myDuration : 2000,
                    myEffect : 'linear'
                }
            
        		$scope.ulbList = JSON.parse($scope.dashboardNumbers.ulbsList);
                $scope.selectedUlbIndex = $scope.ulbList.indexOf(ulbName);
                $scope.selectedUlb = $scope.selectedUlbIndex != -1 ? $scope.ulbList[$scope.selectedUlbIndex] : 'All Wards';
                //console.log($scope.selectedUlb);
        		$scope.locationTypes = JSON.parse($scope.dashboardNumbers.locationTypes);
                $scope.filters = {
                    ulbName : ulbName ? ulbName : null
                }
                $scope.filterModel.ward = ulbName ? ulbName : null
                $scope.getData(1);

                if($scope.isAdmin){
                    $scope.ratingDistribution = JSON.parse(result.data.ratingDistribution);
                    $scope.fiveStar = JSON.parse($scope.ratingDistribution.fiveStar);
                    $scope.fourStar = JSON.parse($scope.ratingDistribution.fourStar);
                    $scope.threeStar = JSON.parse($scope.ratingDistribution.threeStar);
                    $scope.twoStar = JSON.parse($scope.ratingDistribution.twoStar);
                    $scope.oneStar = JSON.parse($scope.ratingDistribution.oneStar);
                    $scope.noFeedBack = JSON.parse($scope.ratingDistribution.noFeedBack);
                    //$scope.ratingDistribution = JSON.parse($scope.ratingDistribution);
                    console.log($scope.ratingDistribution);   
                }
        	});
        //}
        
    };

    $scope.ratingData = function(ulbName) {

    }

    $scope.getPages = function(current, totalPages) {
    	var pageArray = [];
    	var startPage,endPage;
    	if (current <= 6) {
            startPage = 1;
            endPage = 10;
        } else if (current + 4 >= totalPages) {
        	//console.log('else if')
            startPage = totalPages - 9;
            endPage = totalPages;
        } else {
            startPage = current - 5;
            endPage = current + 4;
        }

        if(startPage < 1 || endPage > totalPages){
        	startPage = 1;
        	endPage = totalPages;
        }

        for(var i = startPage; i <= endPage; i++){
        	pageArray.push(i);
        }
        return pageArray;

    };

    $scope.getPagination = function(number) {
        return new Array(number);
    };

    var date = new Date();
    $scope.today = date.setDate(date.getDate());
    $scope.yesterday = date.setDate(date.getDate() - 1);

    var date1 = new Date();
    
    $scope.lastWeek = date1.setDate(date1.getDate() - 6);
    var date2 = new Date();
    
    $scope.lastMonth = date2.setDate(date2.getDate() - 30);
    var date3 = new Date();
    
    $scope.last2Week = date2.setDate(date3.getDate() - 13);
    $scope.dateRange = {
    		today : [$scope.today, $scope.today],
    		yesterday : [$scope.yesterday, $scope.yesterday],
    		lastWeek : [$scope.today, $scope.lastWeek],
            last2Weeks : [$scope.today, $scope.last2Week],
    		lastMonth : [$scope.today, $scope.lastMonth]
    };

    

    $scope.changePeriod = function(value) {
    	if(value != 'custom' && value != ''){
	    	$scope.filterModel.fromDate = $filter('date')($scope.dateRange[value][1], 'dd-MM-yyyy');
	    	$scope.filterModel.toDate = $filter('date')($scope.dateRange[value][0], 'dd-MM-yyyy');
    	}

        if(value == ''){
            $scope.filterModel.fromDate = '';
            $scope.filterModel.toDate = '';
        }
    };

    $scope.filterModelCopy = angular.copy($scope.filterModel);
    $scope.filterData = function(formData, download) {
    	//console.log(formData);
        var isDownload = download ? download : false;

        console.log($scope.filterModel.ward);
    	$scope.filters = {
            page : 1,
            minRating : $scope.filterModel.ratings != '' ? $scope.filterModel.ratings[0] : 0,
            maxRating : $scope.filterModel.ratings != '' ? $scope.filterModel.ratings[1] : 5,
            locationName : $scope.filterModel.type != '' ? $scope.filterModel.type : null,
            ulbName : ($scope.filterModel.ward != 'All Wards' || $scope.filterModel.ward != '') ? $scope.filterModel.ward : null,
            sDate : $scope.filterModel.fromDate != '' ? $scope.filterModel.fromDate : null,
            eDate : $scope.filterModel.toDate != '' ? $scope.filterModel.toDate : null,
            download : isDownload
        }
    	console.log($scope.filters);
        if(isDownload){
            $scope.downloadReport();
            return;
        }
    	$scope.getData(1);
    };


    $scope.setFilters = function(rating, period) {

            $scope.filterModel.ratings = [rating, rating],
            $scope.filterModel.period = period == 'last2Weeks' ? 'custom' : period;
         $scope.changePeriod(period);
        $scope.filterData(null, false);

    }

    $scope.downloadReport = function(pageNumber) {
        window.open(baseURL+"download-report-of-locations/"+$scope.filters.minRating+"/"+$scope.filters.maxRating+"/"+$scope.filters.page+"/10/?locationType="+$scope.filters.locationName+"&startDate="+$scope.filters.sDate+"&endDate="+$scope.filters.eDate+"&ulbName="+$scope.filters.ulbName);
    }

    $scope.clearFilters = function() {
        $scope.filterModel = $scope.filterModelCopy;
        //console.log($scope.filterModel);
    };

    $scope.getReviews = function(id, page, size, showModal) {
        if(!showModal){
            $('#reviews').modal({show:true});
        }
    	DashboardService.getReviews(id, page, size ).then(function(result) {
    		$scope.reviews = JSON.parse(result.data.content);
    		//console.log($scope.reviews);
    	})
        
    };

    $scope.showToiletDetails = function(data) {
        //console.log(data);
        $scope.toiletDetail = data;

        $scope.showDetails = true;
        $("[href='#oRatings']").tab('show');
        $scope.getReviews(data.location.id, 0, 5, true);
        
        if($scope.isAdmin){
            DashboardService.getRatingData($scope.toiletDetail.location.id).then(function(result) {
                console.log(result);

                var graphData = JSON.parse(result.data.content);
                var pieData = JSON.parse(result.data.overall);
                //console.log(graphData[0]);
                var dates = [];
                var values = [];
                var name = 1;
                angular.forEach(graphData, function(key, value) {
                    dates.push(value);

                    //console.log(JSON.parse(key));
                    var val = {
                        name: '',
                        data: []
                    }
                    var keyParsed = JSON.parse(key);
                    
                    for(var i=1;i< 7; i++){
                        val.data.push(keyParsed[i]);
                        if(i == 5 && name < 6){
                            val.name = name+' Stars';
                            name ++;
                            
                        }
                    }
                    values.push(val);
                });

                //console.log(dates);
                ChartService.getBarGraph(dates, values);
                ChartService.getPieChart(pieData);
            });
        }
    };
    $scope.closeDetails = function() {
        $scope.showDetails = false;
    }
    //console.log($scope.dateRange);
    $scope.init = function(ulbName, isAdmin) {
        $scope.isAdmin = true;
    	$scope.getNumbers(ulbName);
        if(!ulbName){
            MapService.drawMap($scope.getNumbers, $scope.gmap);
            
        }
    };


}]);