	Ext.onReady(function()
	{
	  var logf = new Ext.FormPanel({
		renderTo:"log",
		title:"用户登录",
		width:300,
		height:150,
		frame:true,
		floating:true,
		defaultType:"textfield",
		labelAlign:"right",
		url:"/login",
		items:[
		{
		 fieldLabel:"用户名"
		},
		{
		 inputType:"password",
		 fieldLabel:"密码"
		}
		],
		buttons:[{text:"登录",handler:function(){
				this.up('form').getForm().submit(

			{
				success: function(form, action) {
                       		Ext.Msg.alert('Success', action.result);
                    		},
                    		failure: function(form, action) {
                        	Ext.Msg.alert('Failed', action.result);
                   		}

			});
			}},
			{text:"重置",handler:function(){
			this.up('form').getForm().reset();
			}}
			]
		});
	var vp = new Ext.Viewport();
	var x = (vp.getSize().width - logf.getSize().width)/2;
	var y = (vp.getSize().height - logf.getSize().height)/2;	
	logf.setPosition(x,y);
	});
