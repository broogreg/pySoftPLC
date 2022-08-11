// Rung test data.
rungdata = {
"subroutinename" : "LadderDemo",
"subrcomments" : "Demonstrate different ladder instructions. This subroutine doesn't \
actually do anything useful. Click on the subroutine title bar above in order to edit \
this comment.",
"signature" : 0,


"rungdata" : [ 
	{"matrixdata" : {"inputedit00" : {"value" : "noc", "addr" : ["X1"]},
			"inputedit10" : {"value" : "noc", "addr" : ["X2"]},
			"inputedit01" : {"value" : "brancht", "addr" : [""]},
			"inputedit11" : {"value" : "branchr", "addr" : [""]},
			"inputedit02" : {"value" : "ncc", "addr" : ["X3"]},
			"inputedit03" : {"value" : "nocnd", "addr" : ["X4"]},
			"inputedit04" : {"value" : "compgt", "addr" : ["DS100", "DS101"]},
			"outputedit0" : {"value" : "out", "addr" : ["Y1"]},
			"outputedit1" : {"value" : "set", "addr" : ["Y2"]},
			"outputedit2" : {"value" : "rst", "addr" : ["Y3"]},
			"outputedit3" : {"value" : "pd", "addr" : ["Y4"]},
			},
		"rungtype" : "single",
		"comment" : "Click on the rung title bar to edit this rung."
		},

	{"matrixdata" : {"inputedit00" : {"value" : "noc", "addr" : ["X11"]},
			"inputedit10" : {"value" : "noc", "addr" : ["X12"]},
			"inputedit01" : {"value" : "brancht", "addr" : [""]},
			"inputedit11" : {"value" : "branchr", "addr" : [""]},
			"inputedit02" : {"value" : "ncc", "addr" : ["X13"]},
			"inputedit03" : {"value" : "nocnd", "addr" : ["X14"]},
			"inputedit04" : {"value" : "compgt", "addr" : ["DS200", "DS201"]},
			"outputedit0" : {"value" : "out2", "addr" : ["Y100", "Y110"]},
			"outputedit1" : {"value" : "set2", "addr" : ["Y120", "Y129"]},
			"outputedit2" : {"value" : "rst2", "addr" : ["Y130", "Y135"]},
			"outputedit3" : {"value" : "pd2", "addr" : ["Y140", "Y500"]},
			},
		"rungtype" : "single",
		"comment" : "Rungs with range address coils."
		},

	{"matrixdata" : {"inputedit00" : {"value" : "ncc", "addr" : ["T5"]},
			"inputedit10" : {"value" : "ncc", "addr" : ["C1"]},
			"inputedit01" : {"value" : "brancht", "addr" : [""]},
			"inputedit11" : {"value" : "branchr", "addr" : [""]},
			"inputedit02" : {"value" : "noc", "addr" : ["C2"]},
			"inputedit03" : {"value" : "hbar", "addr" : [""]},

			"inputedit20" : {"value" : "noc", "addr" : ["C3"]},
			"inputedit21" : {"value" : "noc", "addr" : ["C4"]},
			"inputedit22" : {"value" : "brancht", "addr" : [""]},
			"inputedit32" : {"value" : "branchl", "addr" : [""]},
			"inputedit23" : {"value" : "noc", "addr" : ["C5"]},
			"inputedit33" : {"value" : "noc", "addr" : ["C6"]},
			"inputedit24" : {"value" : "branchtl", "addr" : [""]},
			"inputedit34" : {"value" : "branchr", "addr" : [""]},

			"inputedit04" : {"value" : "brancht", "addr" : [""]},
			"inputedit14" : {"value" : "branchtr", "addr" : [""]},
			"inputedit05" : {"value" : "compeq", "addr" : ["DS100", "50"]},
			"inputedit15" : {"value" : "nocpd", "addr" : ["C100"]},
			"inputedit06" : {"value" : "compgt", "addr" : ["DS112", "86"]},
			"inputedit16" : {"value" : "hbar", "addr" : [""]},
			"inputedit07" : {"value" : "brancht", "addr" : [""]},
			"inputedit17" : {"value" : "branchr", "addr" : [""]},

			"outputedit0" : {"value" : "set", "addr" : ["C101"]},
			},
		"rungtype" : "single",
		"comment" : "Some additional branching."
		},

	{"matrixdata" : {"inputedit00" : {"value" : "noc", "addr" : ["X42"]},

			"outputedit0" : {"value" : "end", "addr" : [""]},
			"outputedit1" : {"value" : "endc", "addr" : [""]},
			"outputedit2" : {"value" : "rt", "addr" : [""]},
			"outputedit3" : {"value" : "rtc", "addr" : [""]},
			"outputedit4" : {"value" : "for", "addr" : ["100", "0"]},
			"outputedit5" : {"value" : "next", "addr" : [""]},
			"outputedit6" : {"value" : "call", "addr" : ["ExampleSubr"]},
			},
		"rungtype" : "single",
		"comment" : "Program control instructions."
		},

	{"matrixdata" : {"inputedit00" : {"value" : "noc", "addr" : ["X43"]},

			"outputedit0" : {"value" : "tmr", "addr" : ["T499", "DS10000", "sec"]},
			"outputedit1" : {"value" : "tmroff", "addr" : ["T333", "32767", "hour"]},
			},
		"rungtype" : "single",
		"comment" : "On delay and off delay timers."
		},

	{"matrixdata" : {"inputedit00" : {"value" : "noc", "addr" : ["X44"]},

			"outputedit0" : {"value" : "copy", "addr" : ["100", "DS1", "0"]},
			"outputedit1" : {"value" : "cpyblk", "addr" : ["DS10000", "DS10001", "DS10002", "0"]},
			"outputedit2" : {"value" : "fill", "addr" : ["DS10000", "DS10001", "DS10002", "0"]},
			"outputedit3" : {"value" : "pack", "addr" : ["C1900", "C1915", "DH1000", "0"]},
			"outputedit4" : {"value" : "unpack", "addr" : ["DH1000", "C1900", "C1915", "0"]},
			},
		"rungtype" : "single",
		"comment" : "Copy instructions."
		},


	{"matrixdata" : {"inputedit00" : {"value" : "noc", "addr" : ["X45"]},

			"outputedit0" : {"value" : "findeq", "addr" : ["1", "DS9998", "DS9999", "DS10000", "C2000", "0"]},
			"outputedit1" : {"value" : "findne", "addr" : ["1", "DS9998", "DS9999", "DS10000", "C2000", "0"]},
			"outputedit2" : {"value" : "findgt", "addr" : ["1", "DS9998", "DS9999", "DS10000", "C2000", "0"]},
			"outputedit3" : {"value" : "findge", "addr" : ["1", "DS9998", "DS9999", "DS10000", "C2000", "0"]},
			"outputedit4" : {"value" : "findlt", "addr" : ["1", "DS9998", "DS9999", "DS10000", "C2000", "0"]},
			"outputedit5" : {"value" : "findle", "addr" : ["1", "DS9998", "DS9999", "DS10000", "C2000", "0"]},
			},
		"rungtype" : "single",
		"comment" : "Find (search) instructions."
		},


	{"matrixdata" : {"inputedit00" : {"value" : "noc", "addr" : ["X46"]},

			"outputedit0" : {"value" : "findieq", "addr" : ["1", "DS9998", "DS9999", "DS10000", "C2000", "0"]},
			"outputedit1" : {"value" : "findine", "addr" : ["1", "DS9998", "DS9999", "DS10000", "C2000", "0"]},
			"outputedit2" : {"value" : "findigt", "addr" : ["1", "DS9998", "DS9999", "DS10000", "C2000", "0"]},
			"outputedit3" : {"value" : "findige", "addr" : ["1", "DS9998", "DS9999", "DS10000", "C2000", "0"]},
			"outputedit4" : {"value" : "findilt", "addr" : ["1", "DS9998", "DS9999", "DS10000", "C2000", "0"]},
			"outputedit5" : {"value" : "findile", "addr" : ["1", "DS9998", "DS9999", "DS10000", "C2000", "0"]},
			},
		"rungtype" : "single",
		"comment" : "Incremental find (search) instructions."
		},

	{"matrixdata" : {"inputedit00" : {"value" : "noc", "addr" : ["X47"]},

			"outputedit0" : {"value" : "mathdec", "addr" : ["DS10000", "1 + 1", "0"]},
			"outputedit1" : {"value" : "mathhex", "addr" : ["DH2000", "1h + 1h", "0"]},
			"outputedit2" : {"value" : "sum", "addr" : ["DS10000", "DS9998", "DS9999", "0"]},
			},
		"rungtype" : "single",
		"comment" : "Math instructions."
		},

	{"matrixdata" : {"inputedit00" : {"value" : "noc", "addr" : ["X1001"]},
			"inputedit10" : {"value" : "noc", "addr" : ["X1002"]},

			"outputedit0" : {"value" : "cntu", "addr" : ["CT250", "1"]},
			},
		"rungtype" : "double",
		"comment" : "Up counter."
		},

	{"matrixdata" : {"inputedit00" : {"value" : "noc", "addr" : ["X1101"]},
			"inputedit10" : {"value" : "noc", "addr" : ["X1102"]},

			"outputedit0" : {"value" : "cntd", "addr" : ["CT250", "1"]},
			},
		"rungtype" : "double",
		"comment" : "Down counter."
		},

	{"matrixdata" : {"inputedit00" : {"value" : "noc", "addr" : ["X1003"]},
			"inputedit10" : {"value" : "ncc", "addr" : ["X1203"]},
			"inputedit20" : {"value" : "noc", "addr" : ["X1205"]},

			"outputedit0" : {"value" : "udc", "addr" : ["CT250", "1"]},
			},
		"rungtype" : "triple",
		"comment" : "Up/down counter."
		},


	{"matrixdata" : {"inputedit00" : {"value" : "noc", "addr" : ["X1105"]},
			"inputedit10" : {"value" : "noc", "addr" : ["X1106"]},

			"outputedit0" : {"value" : "tmra", "addr" : ["T251", "DS1000", "sec"]},
			},
		"rungtype" : "double",
		"comment" : "Accumulating timer."
		},

	{"matrixdata" : {"inputedit00" : {"value" : "noc", "addr" : ["X1006"]},
			"inputedit10" : {"value" : "ncc", "addr" : ["X1306"]},
			"inputedit20" : {"value" : "noc", "addr" : ["X1306"]},

			"outputedit0" : {"value" : "shfrg", "addr" : ["C250", "C261"]},
			},
		"rungtype" : "triple",
		"comment" : "Shift register."
		},

	{"matrixdata" : {
			},
		"rungtype" : "empty",
		"comment" : "An empty rung. The rung below is also empty, and also shows that comments are optional."
		},

	{"matrixdata" : {
			},
		"rungtype" : "empty",
		"comment" : ""
		},

	{"matrixdata" : {"inputedit00" : {"value" : "noc", "addr" : ["T91"]},
			"outputedit0" : {"value" : "out", "addr" : ["C18"]},
			},
		"rungtype" : "single",
		"comment" : "Rung comments can be any arbitrary length at all \
		and span multiple lines while containing lots and lots of pointless \
		text just like this comment which goes on and on forever without \
		actually saying anything particularly useful while illustrating \
		a long comment."
		},

	]

}


