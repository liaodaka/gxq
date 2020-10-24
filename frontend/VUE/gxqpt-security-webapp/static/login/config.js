function getServerInfoConfi () {
	var con = {
		sso_ip: "127.0.0.1",
		sso_port: "10087"
	}
	var host = window.location.host
	if (host.indexOf('192') == -1 && host.indexOf('localhost') == -1) {
		con.sso_ip = window.location.hostname;
		con.sso_port = window.location.port;
	}
	return con
}
window.serverInfoConfi=getServerInfoConfi();
window.loginConfig = {
	sso_login_url: "http://"+serverInfoConfi.sso_ip+":"+serverInfoConfi.sso_port+"/gxqpt-center/slogin",
	sso_validate_url: "http://"+serverInfoConfi.sso_ip+":"+serverInfoConfi.sso_port+"/gxqpt-center/svalidate",
	sso_logout_url: "http://"+serverInfoConfi.sso_ip+":"+serverInfoConfi.sso_port+"/gxqpt-center/logout",
	security_local_service_url: "gxqpt-security/index.html",
	softhard_local_service_url: "gxqpt-softhard/index.html",
	supervise_local_service_url: "gxqpt-supervise/index.html",
	operation_local_service_url: "gxqpt-operation/index.html",
	warn_local_service_url: "gxqpt-warn/index.html",
	"gxqpt-security_appKey": "z22_t4Tk5ahn5tby6upurqlGF7t3rndilPXqdvT7faj5vVVirUduDyT8.7xB0c",
	"gxqpt-softhard_appKey": "xdN_vPTwpkjf8FvqpCTfhd0u4rddr.tcbpdu468QDkjNdVBqxWBvmnP9.eXF0r",
	"gxqpt-supervise_appKey": "p553t8tgHujjv8b7pw8zrCp9prHgb8R8xkvsd.pDtuhCzdbtJs6SxVZUefw71FQ0a",
	"gxqpt-operation_appKey": "z8VIZttWHuj6f4rsrYvs0otBjWtvvU6ajfvfbstqtc33i8Coh0k",
	"gxqpt-warn_appKey": "pZd1t10.jifz5FzapkrxvwxaJtjnB7tqfkbzVfvCPsbpLjZ2_56BN"
};
