/*
 * Copyright (C) 2015, 2020  Green Screens Ltd.
 *
 * https://www.greenscreens.io
 *
 */
package io.greenscreens.demo1;

import java.util.Objects;

import jakarta.inject.Inject;
import jakarta.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.greenscreens.demo.DemoURLConstants;
import io.greenscreens.quark.QuarkUtil;
import io.greenscreens.quark.cdi.Required;
import io.greenscreens.quark.ext.ExtJSResponse;
import io.greenscreens.quark.ext.annotations.ExtJSAction;
import io.greenscreens.quark.ext.annotations.ExtJSDirect;
import io.greenscreens.quark.ext.annotations.ExtJSMethod;

/**
 * Example controller class to work with AS400 object
 */
@ExtJSDirect(paths = { DemoURLConstants.WSOCKET, DemoURLConstants.API })
@ExtJSAction(namespace = DemoURLConstants.NAMESPACE, action = "AS400")
public class AS400Controller {

	private static final Logger LOG = LoggerFactory.getLogger(AS400Controller.class);

	// we support storing multiple as400 objects under different names
	// use for an example @SessionAttribute("as400") or just use default
	// use @Authenticated to inject only if valid (in other controllers) 
	@Inject 
	SystemI as400;

	// we have our own producer, as default will inject session only if it exists
	@Inject @Autoinit
	HttpSession session;

	@ExtJSMethod("login")
	public ExtJSResponse login(@Required final String system,
							@Required final String userName,
							@Required final String password) {

		final ExtJSResponse.Builder resp = ExtJSResponse.Builder.create();

		try {
			as400.setUsePasswordCache(false);
			as400.setSystemName(system);
			resp.setStatus(as400.validateSignon(userName, password));
		} catch (Exception e) {
			final String msg = QuarkUtil.toMessage(e);
			resp.setMessage(msg);
			LOG.error(msg);
			LOG.debug(msg, e);
		}

		return resp.build();
	}

	@ExtJSMethod("logout")
	public ExtJSResponse logout() {
		if (Objects.nonNull(as400)) as400.disconnectAllServices();		
		if (Objects.nonNull(session)) session.invalidate();
		return new ExtJSResponse(true, null);
	}

}
