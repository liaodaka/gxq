
package com.hengyunsoft.security.auth.client.jwt;

import com.hengyunsoft.exception.BizException;
import com.hengyunsoft.security.auth.client.config.ServiceAuthConfig;
import com.hengyunsoft.security.auth.common.event.AuthRemoteEvent;
import com.hengyunsoft.security.auth.common.util.jwt.IJWTInfo;
import com.hengyunsoft.security.auth.common.util.jwt.JWTHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Created by tangyh on 2017/9/15.
 */
@Configuration
@EnableScheduling
public class ServiceAuthUtil implements ApplicationListener<AuthRemoteEvent> {
    private static final Logger log = LoggerFactory.getLogger(ServiceAuthUtil.class);

    @Autowired
    private ServiceAuthConfig serviceAuthConfig;
    //@Autowired
    //private ServiceAuthFeign serviceAuthFeign;
    //private String clientToken;


    public IJWTInfo getInfoFromToken(String token) throws BizException {
        return JWTHelper.getInfoFromToken(token, serviceAuthConfig.getPubKeyPath());
    }


    //@Scheduled(cron = "0 0 0/1 * * ?")
    //public void refreshClientToken() {
    //    log.info("refresh client token.....");
    //    Result<TokenVo> resp = serviceAuthFeign.getAccessToken(serviceAuthConfig.getClientId(), serviceAuthConfig.getClientSecret());
    //    if (resp.isSuccess() && resp.getData() != null) {
    //        this.clientToken = resp.getData().getToken();
    //    }
    //}


    //public String getClientToken() {
    //    if (this.clientToken == null) {
    //        this.refreshClientToken();
    //    }
    //    return clientToken;
    //}


    @Override
    public void onApplicationEvent(AuthRemoteEvent authRemoteEvent) {
        log.info("onApplicationEvent");
    }
}