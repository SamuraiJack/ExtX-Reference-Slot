Role('ExtX.Reference.Slot', {
    
    have : {
        slot            : null,
        siblingSlots    : null,
        __SLOT__        : null,
        __COLLECTOR__   : null
    },
    
    before : {
        beforeDestroy : function (){
            if (this.__SLOT__) {
                delete this.__COLLECTOR__.slots[this.__SLOT__]
                delete this.__COLLECTOR__
                delete this.__SLOT__
            }
        }
    }
})
    

Ext.BoxComponent.meta.extend({
    does : [ ExtX.Reference.Slot ]
})



Role('ExtX.Reference.Slot.Container', {
    
    have : {
        slots       : null
    },
    
    
    before : {
        
        initComponent : function () {
            if (this.slots) this.slots = {}
            
            this.addEvents('add')
            this.on('add', this.setupSlots, this)
        },
        
        
        beforeDestroy : function (){
            this.un('add', this.setupSlots, this)
        }
        
    },
    
    methods : {
        setupSlots: function(){
            var self = this
            
            this.cascade(function (component){
                
                if (component.slot && component != self) {
                    
                    var parentWithSlots = component.findParentBy(function (container, component) {
                        return Boolean(container.slots)
                    })
                    
                    if (!parentWithSlots) return
                    
                    parentWithSlots.slots[component.slot] = component
                    
                    component.siblingSlots = parentWithSlots.slots
                    component.__SLOT__ = component.slot
                    component.__COLLECTOR__ = parentWithSlots
                    
                    delete component.slot
                }
            })
        },
        
        
        setActiveSlot : function (slot) {
            var layout = this.getLayout()
            
            if (!layout.meta.hasMethod('setActiveItem')) throw new Error("Can't use `setActiveSlot` with [" + this + "] - layout has no `setActiveItem` method")
            
            var item                    = this.slots[ slot ]
            var isCurrentDifferent      = layout.activeItem != item
            
            if (isCurrentDifferent) layout.setActiveItem(item)                    
            
            return isCurrentDifferent
        }
    }
})
//eof Container
    

Ext.Container.meta.extend({
    does : [ ExtX.Reference.Slot.Container ]
})
