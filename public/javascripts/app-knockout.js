var viewModels = viewModels || {};

(function(models){

    models.MainViewModel = function(){
        var self = this;

        self.Doctors = ko.observableArray([]);
        self.Classes = ko.observableArray(['All','A','B','none']);
        self.SelectedClass = ko.observable();
        self.Months = ko.observableArray([]);
        self.SelectedMonth = ko.observable();
        self.Query = ko.observable();

        self.DistinctMonths = ko.computed(function(){
            var dMonths = [];
            ko.utils.arrayMap(self.Doctors(), function(doc){
                if(dMonths.length > 0){
                    var found = false;
                    dMonths.forEach(function(item){
                        if(item === doc.month()){
                            if(!found)
                                found = true;
                        }
                    })
                    if(!found)
                        dMonths.push(doc.month());
                }
                else
                    dMonths.push(doc.month());
            }, self);
            return dMonths;
        });

        self.FilteredDoctors = ko.computed(function () {

            var DocClassA = ko.utils.arrayFilter(self.Doctors(), function(doc){
                        return doc.CLASS() == 'A' && self.SelectedMonth() == doc.month();
                    });
            var DocClassB = ko.utils.arrayFilter(self.Doctors(), function(doc){
                        return doc.CLASS() == 'B' && self.SelectedMonth() == doc.month();
                    });              
            var DocClassNone = ko.utils.arrayFilter(self.Doctors(), function(doc){
                        return doc.CLASS() !== 'A' && doc.CLASS() !== 'B' && self.SelectedMonth() == doc.month();
                    });
            var DocAll = ko.utils.arrayFilter(self.Doctors(), function(doc){
                        return self.SelectedMonth() == doc.month();
                    });                      

            if (!self.Query() || self.Query() == "") {
                if(self.SelectedClass() == 'A')
                    return DocClassA;
                else if(self.SelectedClass() == 'B')
                    return DocClassB;
                else if(self.SelectedClass() == 'none')
                    return DocClassNone;
                else
                    return DocAll;
            } else {
                var filter = self.Query().toLowerCase();

                if(self.SelectedClass() == 'A')
                    return ko.utils.arrayFilter(DocClassA, function (item) {
                    return (item.DRNAME().toLowerCase().indexOf(filter) !== -1 
                            || item.SPL().toLowerCase().indexOf(filter) !== -1
                            || item.place().toLowerCase().indexOf(filter) !== -1) ;
                });    
                else if(self.SelectedClass() == 'B')
                    return ko.utils.arrayFilter(DocClassB, function (item) {
                    return (item.DRNAME().toLowerCase().indexOf(filter) !== -1 
                            || item.SPL().toLowerCase().indexOf(filter) !== -1
                            || item.place().toLowerCase().indexOf(filter) !== -1) ;
                });
                else if(self.SelectedClass() == 'none')
                    return ko.utils.arrayFilter(DocClassNone, function (item) {
                    return (item.DRNAME().toLowerCase().indexOf(filter) !== -1 
                            || item.SPL().toLowerCase().indexOf(filter) !== -1
                            || item.place().toLowerCase().indexOf(filter) !== -1) ;
                });
                else(self.SelectedClass() == 'All')
                    return ko.utils.arrayFilter(DocAll, function (item) {
                    return (item.DRNAME().toLowerCase().indexOf(filter) !== -1 
                            || item.SPL().toLowerCase().indexOf(filter) !== -1
                            || item.place().toLowerCase().indexOf(filter) !== -1) ;
                });     
            }
        });

        self.SaveData = function(){
            var jsonData = ko.toJSON(self.Doctors());
            $.post('https://archanadoctorsapp.herokuapp.com/saveData', {"data": jsonData}, function(returnedData){
                console.log(returnedData);
                window.location = '/';
            });
        };
    }

    models.DoctorViewModel = function(data){
        var self = this;
        
        self._id = ko.observable(data._id);
        self.Seq = ko.observable(data.Seq);
        self.place = ko.observable(data.place);
        self.DRNAME = ko.observable(data.DRNAME);
        self.SPL = ko.observable(data.SPL);
        self.FREQ = ko.observable(data.FREQ);
        self.CLASS = ko.observable(data.CLASS);
        self.month = ko.observable(data.month);

        self.IsVisited = ko.observable(data.IsVisited);
        self.IsVisitedAgain = ko.observable(data.IsVisitedAgain);
        self.IsExpired = ko.observable(data.IsExpired);
        self.IsOnCall = ko.observable(data.IsOnCall);
        self.IsLeftClinic = ko.observable(data.IsLeftClinic);    
    }
})(viewModels);


var AppModule = AppModule || {};

(function(module){
    var _vm = {};
    module.Init = function(){
        _vm = new viewModels.MainViewModel();
    }

    module.Vm = function(){
        return _vm;
    }

    module.BindData = function(data){
        var docVm = ko.utils.arrayMap(data, function(item){
            return new viewModels.DoctorViewModel(item);
        });

        _vm.Doctors(docVm);
    }
})(AppModule);


