/*
PLAN OF FRAMEWORK:
-------------------------------
NOTES:
-As this is a one-page app framework, "page" shall henceforth mean a division of the site such that only one "page" is displayed at a time

1. HTML has custom tags, or tags with certian attributes applied, which break up the document
	1.a. Include dynamic tags to separate out into "pages", possibly:
		1.a.i. qk-page
	1.b. Include static, permanent tags, possibly:
		1.b.i. qk-const
	1.c. (Possibly, we see where this ended up for Angular) Include conditional, Angular-style tags
2. Custom CSS stylesheet bindings per page
3. JS parsing of all of this info
4. Custom DOM abstractor
5. JS using info to carry out info as parsed
-------------------------------
*/
var qk = new function(){

	var pages;
	var datas;
	var currentPage;

	this.go = function(args){
		main.go(args);
	};

	this.goTo = function(to){
		protos.gotoNoArg(to);
	};

	var protos = new function(){
		this.show = function(){
			this.style.display = "block";
		};
		this.hide = function(){
			this.style.display = "none";
		};
		this.gotoNoArg = function(){
			pages[currentPage].hide();
			currentPage = main.pageById(this.dataset.to);
			pages[currentPage].show();
		};
		this.gotoArg = function(toPage){
			pages[currentPage].hide();
			currentPage = toPage;
			pages[currentPage].show();
		};
		this.bindData = function(data, bindTo){
			dataBind.bind(data, bindTo);
		};
	};

	var dataBind = new function(){
		this.bind = function(data, bindTo){
			bindTo.innerHTML = bindTo.innerHTML.replace("[[data.hello]]", parseDataSource(bindTo.dataset.source).hello);
		};

		var parseDataSource = function(path){
			var loc = path.split('.');
			var obj = window;
			while(loc.length > 0){
				obj = obj[loc.shift()];
			}
			return obj;
		}
	};

	var main = new function(){

		var registerElements = function(){
			/**Define qk-page's prototype **/
			var qkpageProto = Object.create(HTMLElement.prototype);
			qkpageProto.show = protos.show;
			qkpageProto.hide = protos.hide;
			/**End qk-page's prototype **/

			/**Define qk-const's prototype **/
			var qkconstProto = Object.create(HTMLElement.prototype);
			qkconstProto.show = protos.show;
			qkconstProto.hide = protos.hide;
			/**End qk-const's prototype **/

			/**Define qk-link's prototype **/
			var qklinkProto = Object.create(HTMLElement.prototype);
			qklinkProto.goto = protos.gotoNoArg;
			/**End qk-link's prototype **/

			/**Define qk-data's prototype **/
			var qkdataProto = Object.create(HTMLElement.prototype);
			qkdataProto.bind = protos.bindData;
			/**End qk-data's prototype **/

			document.registerElement('qk-page', {
				prototype: qkpageProto
			});
			document.registerElement('qk-const', {
				prototype: qkconstProto
			});
			document.registerElement('qk-link', {
				prototype: qklinkProto
			});
			document.registerElement('qk-data', {
				prototype: qkdataProto
			});
		};

		var registerListeners = function(){
			Array.prototype.slice.call(document.querySelectorAll('qk-link')).forEach(function(current){
				current.addEventListener('click', function(){
					current.goto();
				})
			});
		};

		var displayHome = function(home){
			var hId = currentPage = main.pageById(home);
			for(var i = 0, l = pages.length; i < l; i++){
				pages[i].hide();
			}
			pages[hId].show();		
		};

		var fetchPagesAndData = function(){
			pages = document.querySelectorAll('qk-page');
			datas = document.querySelectorAll('qk-data');
		};

		var triggerDataBind = function(){
			for(var i = 0, l = datas.length; i < l; i++){
				datas[i].bind(datas[i].dataset.source, datas[i]);
			}
		};

		this.pageById = function(id){
			for(var i = 0, l = pages.length; i < l; i++){
				if(pages[i].dataset.id===id)
					return i;
			}
			return -1;
		};

		this.go = function(args){
			registerElements();
			registerListeners();
			fetchPagesAndData();
			triggerDataBind();
			displayHome(args.home);
		};
	};

};