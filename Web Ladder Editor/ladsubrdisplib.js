/** ##########################################################################
# Project: 	MBLogic
# Module: 	ladsubrdisplib.js
# Purpose: 	MBLogic ladder editor library.
# Language:	javascript
# Date:		17-Mar-2010.
# Ver:		24-Apr-2010
# Author:	M. Griffin.
# Copyright:	2010 - Michael Griffin       <m.os.griffin@gmail.com>
#
# This file is part of MBLogic.
# MBLogic is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# MBLogic is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
# You should have received a copy of the GNU General Public License
# along with MBLogic. If not, see <http://www.gnu.org/licenses/>.
#
# Important:	WHEN EDITING THIS FILE, USE TABS TO INDENT - NOT SPACES!
##############################################################################
**/

/* This is used to format and displayl an entire subroutine to prepare it for editing.
This handles a complete subroutine, including creating, deleting, and replacing rungs.
*/

function SubrDispControl(docref, ladsymbols) {

	// Reference to editable document.
	this.docref = docref;

	// Ladder symbols definition.
	this.ladsymbols = ladsymbols.LadSymbols;


	// The subroutine name go in this.
	this.SubroutineName = ladsymbols.subroutinename;
	// The subroutine comments go in this.
	this.SubrComments = ladsymbols.subrcomments;

	// The container for holding SVG items.
	this.svgcontainer = ladsymbols.svgcontainer;

	// This gives the ladder rung display items an offset.
	this.laddercontainer = ladsymbols.laddercontainer;

	// The list of static (non-editing) rungs go in here.
	this.staticladderlist = ladsymbols.staticladderlist;

	// Power rail to join inputs to outputs.
	this.svginprail = ladsymbols.svginprail;
	// Power rail to join inputs to outputs (second optional rail).
	this.svginprail2 = ladsymbols.svginprail2;
	// Power rail to join inputs to outputs (third optional rail).
	this.svginprail3 = ladsymbols.svginprail3;

	// Power rail to join outputs together.
	this.svgoutprail = ladsymbols.svgoutprail;
	// Decoration for output rail.
	this.svgoutpraildec = ladsymbols.svgoutpraildec;


	// List of rung editor data. The contents are generated programmatically. 
	this.RungList = [];

	// Maximum number of rungs. (numbered 0 to max).
	this.MaxRung = 99;

	// Padding to add to increase the height of the rung.
	this.RungHeightPad = ladsymbols.RungHeightPad;


	// Parameters for all SVG matrix coordinates. 
	this.AllMatrixParams = ladsymbols.MatrixParams;



	// ==================================================================


	// ##################################################################
	/* Generate a new rung data object to hold all the current rung data.
	This defines the edit "matrix" for the rung we are currently editing.
		"x" (integer) = x position.
		"y" (integer) = y position.
		"type" (string) = inputs or outputs.
	Parameters:
		maxinputrow: (integer) = Maximum number of rows for inputs.
		maxinputcol: (integer) = Maximum number of columns for inputs.
		maxoutputrow: (integer) = Maximum number of rows for outputs.
	*/
	function _GenRungDataObject(maxinputrow, maxinputcol, maxoutputrow) {
		var rungdata= {};
		// Generate the inputs.
		for (var i = 0; i <= maxinputrow; i++) {
			for (var j = 0; j <= maxinputcol; j++) {
				rungdata["inputedit" + i + j] = {"type" : "inputs",
								"row" : i, "col" : j};
			}
		}

		// Generate the outputs.
		for (var i = 0; i <= maxoutputrow; i++) {
			rungdata["outputedit" + i] = {"type" : "outputs", 
							"row" : i, "col" : 0};
		}

		return rungdata;

	}
	this.GenRungDataObject = _GenRungDataObject;


	// ##################################################################
	/* Insert the instruction addresses for a single cell.
	Parameters: addrcell (ref) = A reference to the cell in which the
			addresses will be inserted.
		addrlist (array) = A list (array) of address strings.
		svglist (array) = A list (array) of "id" strings for SVG
			address display elements.
	Returns: addrcell (ref) = A reference to the cell in which the
			addresses have been inserted.
	*/
	function _DisplayAddresses(addrcell, addrlist, svglist) {
		// Display all the addresses (there could be several).
		for (var i=0; i < addrlist.length; i++) {

			// Cell data to display. 
			var celladdrtext = addrlist[i];

			// SVG prototype for displaying addresses.
			var textcellsrc = svglist[i];

			// Set the text.
			if (textcellsrc != null) {
				textcellsrc.firstChild.data = celladdrtext;
				addrcell.appendChild(textcellsrc.cloneNode(true));
			}
		}

		return addrcell;
	}
	this.DisplayAddresses = _DisplayAddresses;


	// ##################################################################
	/* Create a single static (non-editing) rung of ladder.
	Parameters: instrlist (object) = An instruction matrix and associated data.
	*/
	function _CreateStaticRung(instrlist) {

		// Maximum row encountered.
		var maxrow = 0;
		// Maximum output row encountered.
		var maxoutprow = 0;
		// Maximum input column encountered.
		var maxinpcol = 0;
		// Maximum input column encountered in rows 0 to 2.
		var maxinpcolrows = [0, 0, 0];

		// Instruction matrix.
		var instrmatrix = instrlist["matrixdata"];

		// Rung type parameters.
		var rungtype = instrlist["rungtype"];
		var maxinputrow = this.AllMatrixParams[rungtype]["maxinputrow"];
		var maxinputcol = this.AllMatrixParams[rungtype]["maxinputcol"];
		var maxoutputrow = this.AllMatrixParams[rungtype]["maxoutputrow"];
		var inputpitch = this.AllMatrixParams[rungtype]["inputpitch"];
		var outputxpos = this.AllMatrixParams[rungtype]["outputxpos"];
		var inputvert = this.AllMatrixParams[rungtype]["inputvert"];
		var vertpitch = this.AllMatrixParams[rungtype]["vertpitch"];

		// Create the SVG container.
		var container = this.svgcontainer.cloneNode(true);
		container.removeAttribute("id");

		// This is a container to give a display offset to the ladder rung.
		var ladcontainer = this.laddercontainer.cloneNode(true);
		ladcontainer.removeAttribute("id");

		// Generate the rung matrix.
		var rungdata = this.GenRungDataObject(maxinputrow, maxinputcol, maxoutputrow);


		// Create the instruction matrix.
		for (var i in instrmatrix) {
			// Get the ladder symbol.
			var ladsym = this.ladsymbols[instrmatrix[i]["value"]]["symbolref"];
			var instrsymb = ladsym.cloneNode(true);
			instrsymb.removeAttribute("id");

			// Insert the addresses.
			var addrlist = instrmatrix[i]["addr"];
			var svglist = this.ladsymbols[instrmatrix[i]["value"]]["addrref"];
			var instr = this.DisplayAddresses(instrsymb, addrlist, svglist);

			// Row we are currently working on.
			var currentrow = rungdata[i]["row"];

			// Get the correct X coordinate.
			if (rungdata[i]["type"] == "inputs") {
				// Find the maximum input column.
				var currentcol = rungdata[i]["col"];
				var x = currentcol * inputpitch;				

				if (currentcol > maxinpcol) {
					var maxinpcol = currentcol;
				}
				// Find the maximum column for each of rows 0 to 2.
				if (currentrow <= 2) {
					if (currentcol > maxinpcolrows[currentrow]) {
						maxinpcolrows[currentrow] = currentcol;
					}
				}
			} else {
				var x = outputxpos;
				if (currentrow > maxoutprow) {
					var maxoutprow = currentrow;
				}
			}
			var y = rungdata[i]["row"] * inputvert;

			// Set the coordinates. 
			instr.setAttribute("transform", "translate(" + x + "," + y + ")");
			ladcontainer.appendChild(instr);
			if (rungdata[i]["row"] > maxrow) {
				var maxrow = rungdata[i]["row"];
			}

		}

		// Add the joining power rails.
		var inprail = this.svginprail.cloneNode(true);
		inprail.removeAttribute("id");


		// If this is a single rung.
		if (rungtype == "single") {
			// Add the joining rail. For single rungs, the top rail 
			// also depends on the maximum column for any row below it. 
			inprail.setAttribute('x1', inputpitch * (maxinpcol + 1));
			ladcontainer.appendChild(inprail);
			// We use a decorative dot only for single rungs.
			var decoration = this.svgoutpraildec.cloneNode(true);
			decoration.removeAttribute("id");
			ladcontainer.appendChild(decoration);
		}

		// If this is a double rung.
		if ((rungtype == "double") || (rungtype == "triple")) {
			// For double and triple rungs, the top rail doesn't care what the
			// lower rows are doing.
			inprail.setAttribute('x1', inputpitch * (maxinpcolrows[0] + 1));
			ladcontainer.appendChild(inprail);
			// Rail 2.
			var inprail2 = this.svginprail2.cloneNode(true);
			inprail2.removeAttribute("id");
			inprail2.setAttribute('x1', inputpitch * (maxinpcolrows[1] + 1));
			ladcontainer.appendChild(inprail2);
		}

		// If this is a double rung.
		if (rungtype == "triple") {
			var inprail3 = this.svginprail3.cloneNode(true);
			inprail3.removeAttribute("id");
			inprail3.setAttribute('x1', inputpitch * (maxinpcolrows[2] + 1));
			ladcontainer.appendChild(inprail3);
		}

		// Rail which joins outputs together.
		var outprail = this.svgoutprail.cloneNode(true);
		outprail.removeAttribute("id");
		outprail.setAttribute('y2', vertpitch * maxoutprow);
		ladcontainer.appendChild(outprail);



		// Set the height for the SVG container.
		var inpheight = (maxrow + 1) * inputvert;
		var outpheight = (maxoutprow + 1) * vertpitch;
		if (rungtype == "empty") {
			var svgheight = 0;
		} else {
			var svgheight = (Math.max(inpheight, outpheight) + this.RungHeightPad)
		}
		container.setAttribute("height", svgheight + "px");

		// Add the rung to the SVG container. 
		container.appendChild(ladcontainer);
		

		// Return the rung SVG.
		return container;

	}
	this.CreateStaticRung = _CreateStaticRung;



	// ##################################################################
	/* Create the HTML rung containers for a single rung. This will be either
	appended to the end of the ladder diagram, or inserted above a reference
	rung, depending on the parameters selected.
	Parameters: rungdata (object) = An instruction matrix and associated data
		for a single rung.
		rungnumber (integer) = The rung number.
		insertabove (boolean) = If true, insert above the reference rung.
		aboverungref (integer) = The reference id number of the rung 
			above which the rung is to be inserted. If "aboverungref" 
			is false, this parameter is ignored.
	*/
	function _CreateSingleRung(rungdata, rungnumber, insertabove, aboverungref) {

		// Get the rung reference number.
		var rungref = rungdata["reference"];

		// Container div.
		var rungcontainer = this.docref.createElement("div");
		rungcontainer.setAttribute("class", "ladderdisplaystyle");
		rungcontainer.setAttribute("id", "rung" + rungref);

		// Check if we insert the new rung above the reference position,
		// or if we simple append it to the end.
		if (insertabove) {
			var aboverung = this.docref.getElementById("rung" + aboverungref);
			this.staticladderlist.insertBefore(rungcontainer, aboverung);
		} else {
			this.staticladderlist.appendChild(rungcontainer);
		}

		// Insert button.
		var insertcontainer = this.docref.createElement("div");
		insertcontainer.setAttribute("class", "insertbuttonstyle");
		var insertbutton = this.docref.createElement("button");
		insertbutton.setAttribute("onclick", "RungInsert('" + rungref + "');");
		var insertbuttonname = this.docref.createTextNode("Insert Rung");
		insertbutton.appendChild(insertbuttonname);
		insertcontainer.appendChild(insertbutton);
		rungcontainer.appendChild(insertcontainer);


		// Rung number area.
		var rungnumb = this.docref.createElement("p");
		rungnumb.setAttribute("class", "rungnumberarea");
		rungnumb.setAttribute("id", "rungnumberid" + rungref);
		var rungvalue = this.docref.createTextNode("Rung: " + (rungnumber + 1));
		rungnumb.appendChild(rungvalue);
		var editcommands = "RungEdit('" + rungref + "');";
		rungnumb.setAttribute("onclick", editcommands);
		rungcontainer.appendChild(rungnumb);

		// Comments. 
		var commentarea = this.docref.createElement("p");
		commentarea.setAttribute("id", "rungcomment" + rungref);
		commentarea.setAttribute("class", "commentarea");
		var commentvalue = this.docref.createTextNode(rungdata["comment"]);
		commentarea.appendChild(commentvalue);
		rungcontainer.appendChild(commentarea);


		// Rung edit buttons container. 
		var editbuttoncontainer = this.docref.createElement("div");
		editbuttoncontainer.setAttribute("class", "runghide");
		editbuttoncontainer.setAttribute("id", "rungeditbuttons" + rungref);
		// Add the edit button container to the rung.
		rungcontainer.appendChild(editbuttoncontainer);


		// Static rung SVG.
		var staticrung = this.docref.createElement("div");
		staticrung.setAttribute("id", "staticrung" + rungref);
		staticrung.setAttribute("class", "ladderdisplaystyle");
		var rung = this.CreateStaticRung(rungdata);
		staticrung.appendChild(rung);
		rungcontainer.appendChild(staticrung);

		// Instruction edit buttons.
		var runginstrbuttons = this.docref.createElement("div");
		runginstrbuttons.setAttribute("id", "runginstructionbuttons" + rungref);
		rungcontainer.appendChild(runginstrbuttons);
		
		// Address edit area.
		var addressedit = this.docref.createElement("div");
		addressedit.setAttribute("id", "rungaddredit" + rungref);
		rungcontainer.appendChild(addressedit);

		// Ladder edit area.
		var editladder = this.docref.createElement("div");
		editladder.setAttribute("id", "rungeditladder" + rungref);
		rungcontainer.appendChild(editladder);

	}
	this.CreateSingleRung = _CreateSingleRung;



	// ##################################################################
	/* Create the list of rungs. 
	Parameters: rungdata (object) = An instruction matrix list containing
		all the rung data.
	*/
	function _CreateRungList(rungdata) {

		// Add the subroutine name to the page.
		var subname = this.docref.createTextNode("SBR " + rungdata["subroutinename"]);
		this.SubroutineName.appendChild(subname);
		// Add the subroutine comments to the page.
		var subrcommentdata = this.docref.createTextNode(rungdata["subrcomments"]);
		this.SubrComments.appendChild(subrcommentdata);


		// The rung data.
		var instrlist = rungdata["rungdata"];

		// Go through the list of rung data and create new rungs.
		for (var i=0; i< instrlist.length; i++) {
			this.CreateSingleRung(instrlist[i], i, false, 0);
		}

	}
	this.CreateRungList = _CreateRungList;



	// ##################################################################
	/* Remove the static part of a rung. This leaves the static rung
		div in place.
	Parameters: rungref (integer) = The rung reference number to be removed.
	*/
	function _RemoveStaticRung(rungref) {
		var staticrungref = this.docref.getElementById("staticrung" + rungref);
		// If there are any existing elements, remove them first.
		if (staticrungref.hasChildNodes()) {
			while (staticrungref.firstChild) {
				staticrungref.removeChild(staticrungref.firstChild);
			}
		} 
	}
	this.RemoveStaticRung = _RemoveStaticRung;


	// ##################################################################
	/* Replace an existing static rung.
	Parameters: rungdata (object) = The current rung data storage object. 
		rungref (integer) = The rung reference number to be replaced.
	*/
	function _ReplaceStaticRung(rungdata, rungref) {
		// Erase the existing static rung.
		this.RemoveStaticRung(rungref);
		// Add the new rung.
		var staticrung = this.docref.getElementById("staticrung" + rungref);
		var rung = this.CreateStaticRung(rungdata);
		staticrung.appendChild(rung);
	}
	this.ReplaceStaticRung = _ReplaceStaticRung;


	// ##################################################################
	/* Append a new static rung to the end of the subroutine.
	Parameters: rungdata (object) = The current rung data storage object. 
		rungnumber (integer) = The rung number to be replaced.
	*/
	function _AppendStaticRung(rungdata, rungnumber) {
		// Create the new rung and display it.
		this.CreateSingleRung(rungdata, rungnumber, false, 0);
	}
	this.AppendStaticRung = _AppendStaticRung;


	// ##################################################################
	/* Insert a new static rung in the specified rung position.
	Parameters: rungdata (object) = The current rung data storage object. 
		rungnumber (integer) = The new rung number.
		aboverungref (integer) = The reference rung above which to insert the new one.
	*/
	function _InsertStaticRung(rungdata, rungnumber, aboverungref) {
		// Create the new rung and insert it.
		this.CreateSingleRung(rungdata, rungnumber, true, aboverungref);
	}
	this.InsertStaticRung = _InsertStaticRung;

	// ##################################################################
	/* Renumber all the rungs on the page consecutively. This may be 
	necessary after a rung has been deleted or inserted.
	Parameters: rungreflist (array) = An ordered list (array) of rung 
		reference numbers, where the index position of each reference 
		number corresponds to the rung number (minus one).
	*/
	function _RenumberStaticRungs(rungreflist) {
		// Go through the list of rungs.
		for (var rungnumber=0; rungnumber<rungreflist.length; rungnumber++) {
			// Delete the existing rung number text.
			var rungname = this.docref.getElementById("rungnumberid" + rungreflist[rungnumber]);
			rungname.removeChild(rungname.firstChild);
			// Now, add the new rung number text. 
			var newrungtext = this.docref.createTextNode("Rung: " + (rungnumber + 1));
			rungname.appendChild(newrungtext);
		}
	}
	this.RenumberStaticRungs = _RenumberStaticRungs;


	// ##################################################################
	/* Hide the static rung display.
	Parameters: rungref (integer) = Rung reference number.
	*/
	function _HideStaticRung(rungref) {
		// Hide the static rung data.
		var rung = this.docref.getElementById("staticrung" + rungref);
		// We have to do this via a class for some reason.
		rung.setAttribute("class", "runghide");

		// Show the address edit area.
		var addredit = this.docref.getElementById("rungaddredit" + rungref);
		addredit.setAttribute("class", "rungshow");
	}
	this.HideStaticRung = _HideStaticRung;


	// ##################################################################
	/* Show the static rung display.
	Parameters: rungref (integer) = Rung reference number.
	*/
	function _ShowStaticRung(rungref) {
		// Show the static rung data.
		var staticrung = this.docref.getElementById("staticrung" + rungref);
		staticrung.setAttribute("class", "rungshow");

		// Hide the address edit area.
		var addredit = this.docref.getElementById("rungaddredit" + rungref);
		addredit.setAttribute("class", "runghide");
	}
	this.ShowStaticRung = _ShowStaticRung;


	// ##################################################################
	/* Delete a rung. 
	Parameters: rungref (integer) = Rung reference number.
	*/
	function _DeleteRung(rungref) {
		var rung = this.docref.getElementById("rung" + rungref);
		// If there are any existing elements.
		if (rung.hasChildNodes()) {
			while (rung.firstChild) {
				rung.removeChild(rung.firstChild);
			}
		} 
	}
	this.DeleteRung = _DeleteRung;


}

/** ########################################################################## */

