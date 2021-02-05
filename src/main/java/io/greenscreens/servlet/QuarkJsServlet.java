/*
 * Copyright (C) 2015, 2020  Green Screens Ltd.
 *
 * https://www.greenscreens.io
 *
 */
package io.greenscreens.servlet;

import java.io.IOException;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import io.greenscreens.quark.web.QuarkAPIServlet;

/**
 * Quark embedded script from quark.jar 
 * 
 * http://localhost/demo/quark.js
 */
@WebServlet("/quark.js")
public class QuarkJsServlet extends QuarkAPIServlet {

	private static final long serialVersionUID = 1L;
	
	@Override
	protected void onGet(final HttpServletRequest request, final HttpServletResponse response) throws IOException {
		script(request, response);
	}

}
