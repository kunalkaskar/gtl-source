app.controller('dashboardController', ['$scope', 'DashboardService', '$filter', 'MapService', 'ChartService', function ($scope, DashboardService, $filter, MapService, ChartService) {
    $scope.locationData;
    $scope.currentPage = 1;
    $scope.totalPages = 496;
    $scope.isAdmin = false;
    $scope.filters = {};

    $scope.showDetails = false;

    $scope.filterModel = {
        ratings : [0, 5],
        min : 0,
        max : 5,
        ward : $scope.selectedUlb ? $scope.selectedUlb : '',
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
            console.log(result);
        });
    };

    $scope.getNumbers = function(ulbName) {
        console.log(ulbName);
        //if(!$scope.dashboardNumbers){
    	   DashboardService.getNumbers(ulbName).then(function(result) {
    		console.log(result.data);
        		$scope.dashboardNumbers = result.data;
                $scope.totalToilets = {
                    myValue : 0,
                    myTarget : parseInt($scope.dashboardNumbers.totalToilets) || 1000,
                    myDuration : 2000,
                    myEffect : 'linear'
                }
                console.log(parseInt($scope.dashboardNumbers.totalToilets));

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
                $scope.selectedUlb = $scope.ulbList[$scope.selectedUlbIndex];
                console.log($scope.selectedUlb);
        		$scope.locationTypes = JSON.parse($scope.dashboardNumbers.locationTypes);
                $scope.filters = {
                    ulbName : ulbName ? ulbName : null
                }
                $scope.filterModel.ward = ulbName ? ulbName : ''
                $scope.getData(1);
        	});

        
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
        	console.log('else if')
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
    
    $scope.lastMonth = date2.setDate(date2.getDate() - 30)
    $scope.dateRange = {
    		today : [$scope.today, $scope.today],
    		yesterday : [$scope.yesterday, $scope.yesterday],
    		lastWeek : [$scope.today, $scope.lastWeek],
    		lastMonth : [$scope.today, $scope.lastMonth]
    };

    

    $scope.changePeriod = function(value) {
    	if(value != 'custom'){
	    	$scope.filterModel.fromDate = $filter('date')($scope.dateRange[value][0], 'dd-MM-yyyy');
	    	$scope.filterModel.toDate = $filter('date')($scope.dateRange[value][1], 'dd-MM-yyyy');
    	}
    };

    $scope.filterModelCopy = angular.copy($scope.filterModel);
    $scope.filterData = function(formData) {
    	//console.log(formData);

    	$scope.filters = {
            page : 1,
            minRating : $scope.filterModel.ratings != '' ? $scope.filterModel.ratings[0] : 0,
            maxRating : $scope.filterModel.ratings != '' ? $scope.filterModel.ratings[1] : 5,
            locationName : $scope.filterModel.type != '' ? $scope.filterModel.type : null,
            ulbName : $scope.filterModel.ward != '' ? $scope.filterModel.ward : null,
            sDate : $scope.filterModel.fromDate != '' ? $scope.filterModel.fromDate : null,
            eDate : $scope.filterModel.toDate != '' ? $scope.filterModel.toDate : null
        }
    	console.log($scope.filters);
    	$scope.getData(1);
    };

    $scope.clearFilters = function() {
        $scope.filterModel = $scope.filterModelCopy;
        console.log($scope.filterModel);
    };

    $scope.getReviews = function(id, page, size, showModal) {
        if(!showModal){
            $('#reviews').modal({show:true});
        }
    	DashboardService.getReviews(id, page, size ).then(function(result) {
    		$scope.reviews = JSON.parse(result.data.content);
    		console.log($scope.reviews);
    	})
        
    };

    $scope.showToiletDetails = function(data) {
        console.log(data);
        $scope.toiletDetail = data;

        $scope.showDetails = true;
        $("[href='#oRatings']").tab('show');
        $scope.getReviews(data.location.id, 0, 5, true);
        ChartService.getPieChart();
        if($scope.isAdmin){
            DashboardService.getRatingData($scope.toiletDetail.location.id).then(function(result) {
                //console.log(result);

                var graphData = JSON.parse(result.data.content);
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

                console.log(dates);
                ChartService.getBarGraph(dates, values);
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
            MapService.drawMap();
        }
    };


}]);