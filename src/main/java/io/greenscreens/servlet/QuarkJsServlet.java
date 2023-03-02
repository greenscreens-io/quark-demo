/*
 * Copyright (C) 2015, 2020  Green Screens Ltd.
 *
 * https://www.greenscreens.io
 *
 */
package io.greenscreens.servlet;

import java.io.IOException;
import java.util.Objects;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import io.greenscreens.quark.web.QuarkAPIServlet;

/**
 * Quark embedded script from quark.jar 
 * 
 * http://localhost/demo/quark.js
 */
@WebServlet(urlPatterns = {Constants.QUARK, Constants.MAP})
public class QuarkJsServlet extends QuarkAPIServlet {

	private static final long serialVersionUID = 1L;
	
	@Override
	protected void onGet(final HttpServletRequest request, final HttpServletResponse response) throws IOException {
		
		final String servletPath = request.getServletPath();
		final boolean isScript = servletPath.contains(Constants.QUARK);
		
		if (isScript) {
			script(request, response);
			return;
		} 
		
		if (servletPath.endsWith("map")) {
			map(request, response);
			return;			
		}
		
		final String path = request.getParameter("q");
		if (Objects.isNull(path)) {			
			services(response);
			return;
		}
		
		final String[] paths = new String[] {path};	
		build(request, response, paths);	
	}

}
