/*
 * Copyright (C) 2015, 2025 Green Screens Ltd.
 *
 * https://www.greenscreens.io
 *
 */
package io.greenscreens.demo1;

import java.util.Enumeration;

import jakarta.enterprise.inject.Produces;
import jakarta.servlet.ServletRequestListener;
import jakarta.servlet.annotation.WebListener;
import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.HttpSessionEvent;
import jakarta.servlet.http.HttpSessionListener;

import com.ibm.as400.access.AS400;

import io.greenscreens.quark.QuarkProducer;

/**
 * Custom session producer which will always create http session
 * Also, will destroy all as400 object connections if exists upon session destruction.
 */
@WebListener
public class SessionProducer implements ServletRequestListener, HttpSessionListener {
    
    @Override
	public void sessionCreated(final HttpSessionEvent se) {}

    /**
     * We want to ensure to release as400 resources if session is destroyed 
     */
	@Override
	public void sessionDestroyed(final HttpSessionEvent se) {

		final HttpSession session = se.getSession();
		final Enumeration<String> keys = session.getAttributeNames();
		
		while (keys.hasMoreElements()) {
			
			String key = keys.nextElement();
			Object obj = session.getAttribute(key);
		
			if (obj != null && obj instanceof AS400) {
				((AS400)obj).disconnectAllServices();	
			}
			
		}
		
	}

    @Produces @Autoinit
    protected HttpSession getSession() {
        return QuarkProducer.getWebSession();
    }

}