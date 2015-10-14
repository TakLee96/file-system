var hist = [];
var GET = (url, cb) => {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            cb && cb(xhr.response);
        }
    };
    xhr.responseType = "json";
    xhr.open('GET', url);
    xhr.send();
};

var APP = React.createClass({
    getInitialState: function () {
        return {directories: [], files: [], dir: "/"};                 
    },
    componentWillMount: function () {
        GET("/list?dir=" + encodeURIComponent(this.state.dir), (response) => this.setState({files: response.files, directories: response.directories}));                  
    },
    render: function () {
        return (<div>
            <h3>Path: {this.state.dir}</h3>
            <button onClick={this.back}>back</button>
            <h4>Directories</h4>
            <ul>{this.state.directories.map((file, index) => {
                return <li key={"d"+index}><a href="#" onClick={() => this.update(index)}>{file}</a></li>
            })}</ul>
            <h4>Files</h4>
            <ul>{this.state.files.map((file, index) => {
                return <li key={"f"+index}>{file}</li>;
            })}</ul>
        </div>);
    },
    update: function (index) {
        var file = this.state.directories[index];
        var dir = this.state.dir;
        hist.push(dir);
        dir = dir == "/" ? dir + file : dir + "/" + file;
        GET("/list?dir=" + encodeURIComponent(dir), (response) => this.setState({files: response.files, directories: response.directories, dir: dir}));                  
    },
    back: function () {
        if (hist.length == 0) return;
        var dir = hist.pop();
        GET("/list?dir=" + encodeURIComponent(dir), (response) => this.setState({files: response.files, directories: response.directories, dir: dir}));
    }
});

ReactDOM.render(<APP/>, document.getElementById("app"));
