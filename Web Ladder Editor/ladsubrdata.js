/** ##########################################################################
# Project: 	MBLogic
# Module: 	ladsubrdata.js
# Purpose: 	MBLogic ladder editor library.
# Language:	javascript
# Date:		24-Apr-2010.
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


function LadSubrData() {

	// This is the master record for all the subroutine data.
	this.SubrData = {
		"subroutinename" : "",	// Name of subroutine.
		"subrcomments" : "",	// Subroutine comments.
		"signature" : 0,	// Hash of subroutine to detect changes.
		"rungdata" : []		// The rung data.
	}

	/* This is a master copy of a single rung data record.
	matrixdata = The data matrix. This keys must be "inputedit00" to "inputedit77",
		or "outputedit0" to "outputedit7". Each of these must be a record with
		the value and address. E.g. {"value" : "noc", "addr" : ["X1"]}
	rungtype = The type of rung. Must be "single", "double", "triple", or "empty".
	comment = The rung comment.
	*/
	this.RungDataRecord = {
		"matrixdata" : {},
		"rungtype" : "empty",
		"comment" : "",
		"reference": -1
	}

	// List of currently valid rung numbers in order.
	this.RungNumberList = [];

	// Reference number for creating unique rung ids.
	// We can't use the rung number for web page ids, because as we add
	// and remove rungs we can't go back and renumber existing ids. This means
	// the id and the rung number will not necessarily be the same if we have
	// deleted any rungs.
	this.RungReference = 0;


	// This indexes rung data by reference number.
	this.RungRefIndex = {};


	// ==================================================================
	/* Import initialised data.
	*/
	function _ImportData(subrdata) {
		this.SubrData["subroutinename"] = subrdata["subroutinename"];
		this.SubrData["subrcomments"] = subrdata["subrcomments"];
		var rungs = subrdata["rungdata"];
		for (var i=0; i<rungs.length; i++) {
			this.SubrData["rungdata"].push(
				{"matrixdata" : rungs[i]["matrixdata"],
				"rungtype" : rungs[i]["rungtype"],
				"comment" : rungs[i]["comment"],
				"reference": this.RungReference
				});
			// Update the reference number index.
			this.RungRefIndex[this.RungReference] = i;
			// Increment the rung reference number.
			this.RungReference++;
		}
		
	}
	this.ImportData = _ImportData;


	// ==================================================================


	// ##################################################################
	/* Calculate the maximum rung index. This starts from *zero*, not one.
	*/
	function _CalcMaxRungIndex() {
		return this.MaxRung = this.SubrData["rungdata"].length - 1;
	}
	this.CalcMaxRungIndex = _CalcMaxRungIndex;

	// ##################################################################
	/* Get the rung number, given an id reference number.
	*/
	function _FindRungNumber(rungref) {
		return this.RungRefIndex[rungref];
	}
	this.FindRungNumber = _FindRungNumber;


	// ##################################################################
	/* Append an empty rung to the end of the rung data.
	*/
	function _AppendEmptyRungRecord() {
		// Increment the id reference number.
		this.RungReference++;
		this.SubrData["rungdata"].push({"matrixdata" : {},
						"rungtype" : "empty",
						"comment" : "",
						"reference": this.RungReference
						});
		
		var newrung = this.CalcMaxRungIndex();
		// Update the rung reference number index.
		this.RungRefIndex[this.RungReference] = newrung;
	}
	this.AppendEmptyRungRecord = _AppendEmptyRungRecord;


	// ##################################################################
	/* Insert an empty rung above the specified rung position.
	Parameters: rungref (integers) = The rung reference number (not the actual
		rung number.
	Returns: (integer) = The new rung reference number.
	*/
	function _InsertEmptyRungRecord(rungref) {

		// Get the rung number so we know the position. 
		var rungnumber = this.RungRefIndex[rungref];

		// Increment the id reference number.
		this.RungReference++;

		// Insert the record.
		this.SubrData["rungdata"].splice(rungnumber, 0, 
						{"matrixdata" : {},
						"rungtype" : "empty",
						"comment" : "",
						"reference": this.RungReference
						});

		// Rebuild the rung reference number index.
		this.RebuildRefIndex();

		return this.RungReference;
	}
	this.InsertEmptyRungRecord = _InsertEmptyRungRecord;


	// ##################################################################
	/* Rebuild the rung reference number index.
	*/
	function _RebuildRefIndex() {
		this.RungRefIndex = {};
		for (var i=0; i<this.SubrData["rungdata"].length; i++) {
			var refnum = this.SubrData["rungdata"][i]["reference"];
			this.RungRefIndex[refnum] = i;
		}
	}
	this.RebuildRefIndex = _RebuildRefIndex;

	// ##################################################################
	/* Delete a record.
	Parameters: rungref (integers) = The rung reference number (not the actual
		rung number.
	*/
	function _DeleteRungRecord(rungref) {
		var rungnumber = this.RungRefIndex[rungref];
		// Erase the rung record.
		this.SubrData["rungdata"].splice(rungnumber, 1);
		// Rebuild the rung reference number index.
		this.RebuildRefIndex();
	}
	this.DeleteRungRecord = _DeleteRungRecord;



	// ##################################################################
	/* Set the subroutine name.
	Parameters: comments (string) = The subroutine comments.
	*/
	function _SetSubroutineComments(comments) {
		this.SubrData["subrcomments"] = comments;
	}
	this.SetSubroutineComments = _SetSubroutineComments;


	// ==================================================================


	// ##################################################################
	/* Return the complete set of subroutine data.
	*/
	function _GetSubrData() {
		return this.SubrData;
	}
	this.GetSubrData = _GetSubrData;


	// ##################################################################



	// ==================================================================


	// ##################################################################
	/* Convert an actual rung into a rung reference number.
	Parameters: rungnumber (integer) = The rung number (not the reference number.
	Returns: (integer) = The rung reference number.
	*/
	function _GetRungReference(rungnumber) {
		return this.SubrData["rungdata"][rungnumber]["reference"];
	}
	this.GetRungReference = _GetRungReference;

	// ##################################################################
	/* Return an ordered list (array) of rung references, where the index
	of each rung reference corresponds to the rung number (minus one) as 
	viewed on the web page. 
	Returns: (array) = An array of rung reference integers.
	*/
	function _GetRungRefList() {
		var rungreflist = [];
		for (var i=0; i<this.SubrData["rungdata"].length; i++) {
			rungreflist.push(this.SubrData["rungdata"][i]["reference"]);
		}
		return rungreflist;
	}
	this.GetRungRefList = _GetRungRefList;



	// ##################################################################
	/* Return a single rung data record.
	Parameters: rungref (integer) = The rung reference number (not the
		rung number). 
	*/
	function _GetRungData(rungref) {
		var rungnumber = this.RungRefIndex[rungref];
		return this.SubrData["rungdata"][rungnumber];
	}
	this.GetRungData = _GetRungData;


	// ##################################################################
	/* Set the matrix data for a single rung data record.
	Parameters: matrix (object) = The instruction matrix data for a rung.
		rungref (integer) = The rung reference number (not the
				rung number). 
	*/
	function _SetRungMatrix(matrix, rungref) {
		var rungnumber = this.RungRefIndex[rungref];
		this.SubrData["rungdata"][rungnumber]["matrixdata"] = matrix;
	}
	this.SetRungMatrix = _SetRungMatrix;


	// ##################################################################
	/* Set the comments for a single rung data record.
	Parameters: comment (string) = The comment string for a rung.
		rungref (integer) = The rung reference number (not the
				rung number). 
	*/
	function _SetRungComment(comment, rungref) {
		var rungnumber = this.RungRefIndex[rungref];
		return this.SubrData["rungdata"][rungnumber]["comment"] = comment;
	}
	this.SetRungComment = _SetRungComment;

	// ##################################################################
	/* Set the rung type for a single rung data record.
	Parameters: rungtype (string) = The rung type for a rung.
		rungref (integer) = The rung reference number (not the
				rung number). 
	*/
	function _SetRungType(rungtype, rungref) {
		var rungnumber = this.RungRefIndex[rungref];
		this.SubrData["rungdata"][rungnumber]["rungtype"] = rungtype;
	}
	this.SetRungType = _SetRungType;



}



// ##################################################################


