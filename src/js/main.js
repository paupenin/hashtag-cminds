/**
 * Hashtag helper for Collective Minds Radiology
 */
class hashtagHelper {

    constructor(element, options) {
        this.setOptions(options)
        this.setElement(element)
        this.init()
    }

    setOptions(options) {
        if (typeof options != 'object') options = {}

        let defaults = {
            "case": false,
            "color": '#e2e3e5',
            "tags": null
        }

        this.op = {...defaults, ...options}
    }

    setElement(element) {
        if (typeof element == 'string') {
            element = document.querySelector(element)
        }

        this.el = element
    }
    
    setContent(content) {
        this.el.value = content
    }

    init() {
        this.createContentEditable()
        
        this.createContentTags()

        this.bindContentEditable()

        // Position Caret at end
        this.setCaretPos(this.getElementValue().length)

        // Show Taglist if in valid tag
        this.checkTaglist()

        // Nomalize content on textarea
        this.setContent(this.getContentValue())
    }

    /**
     * Content Editable functions
     */
    createContentEditable() {
        this.ce = document.createElement('div')
        
        this.ce.setAttribute('class', this.el.getAttribute('class') + ' hashtag-cminds-content-editable')
        this.ce.setAttribute('style', this.el.getAttribute('style'))
        this.ce.setAttribute('contenteditable', "true")

        this.el.parentElement.appendChild(this.ce)
    }

    createContentTags(event = null) {
        let content = this.generateHtml()

        if (this.normalize(content) != this.normalize(this.getContentHtml())) {
            let caret_position = this.getCaretPos()

            this.ce.innerHTML = content

            if (this.isInputEnter(event)) {
                this.setCaretPos(caret_position, true)
                return;
            }

            this.setCaretPos(caret_position)
        }
    }

    normalize(string) {
        return string.replace(/\s/g, ' ').replace(/&amp;/g,'&').replace(/&nbsp;/g, ' ')
    }

    getElementValue() {
        return this.el.value
    }

    getContentValue() {
        return this.ce.innerText
    }

    getContentHtml() {
        return this.ce.innerHTML
    }

    generateHtml() {
        return ('<div>'+this.generateTags().replace(/\n/g,'</div><div>')+'</div>')
                .replace(/(<div><\/div>){2,}/g, '<div></div>')
                .replace(/(<div><\/div>)/g, '<div>&nbsp;</div>')
    }

    generateTags() {
        return this.getElementValue().replace(/(#[\w\-&]*)/g, (str, match) => {
            let tag = this.findTag(match)

            let color = (tag && tag.color) ? tag.color : this.op.color

            return `<span style="background: ${color}">${match}</span>`
        })
    }

    findTag(value) {
        if (! this.op.tags) return null

        value = value.substr(1)

        return this.op.tags.find((tag) => {
            if (this.op.case) {
                return (tag.tag == value)
            }
            return (tag.tag.toLowerCase() == value.toLowerCase())
        })
    }

    findTags(value) {
        if (! this.op.tags) return null

        value = value.substr(1)

        return this.op.tags.filter((tag) => {
            if (this.op.case) {
                return tag.tag.startsWith(value)
            }
            return tag.tag.toLowerCase().startsWith(value.toLowerCase())
        })
    }

    bindContentEditable() {
        this.ce.addEventListener("input", (event) => {
            this.setContent(this.getContentValue())
            this.createContentTags(event)
            this.checkTaglist()

            this.trigger('change', this, this.el, this.getElementValue())
        }, false)
    }

    isInputEnter(event) {
        return event && (event.keyCode == 13 || event.inputType == "insertParagraph")
    }

    /**
     * Caret position
     */
    getAllTextnodes(){
        let n, a=[], walk=document.createTreeWalker(this.ce,NodeFilter.SHOW_TEXT,null,false)
        while(n=walk.nextNode()) a.push(n)
        return a
    }

    getCaretPos() {
        this.ce.focus()

        let _range = document.getSelection().getRangeAt(0)
        let range = _range.cloneRange()
        range.selectNodeContents(this.ce)
        range.setEnd(_range.endContainer, _range.endOffset)

        return range.toString().length
    }

    getCaretNode() {
        return document.getSelection().getRangeAt(0).startContainer.parentElement
    }

    setCaretPos(position, next_node = false) {
        this.ce.focus()

        if (position <= 0) return;

        // Get node element
        let node, nodes = this.getAllTextnodes()

        for (let i in nodes) {
            if (position - nodes[i].length > 0 || (next_node && position - nodes[i].length == 0)) {
                position -= nodes[i].length
            } else {
                node = nodes[i]
                break
            }
        }

        // End of content
        if (! node) {
            node = nodes[nodes.length-1]
            position = node.length
        }

        // Set cursor position
        let sel = window.getSelection()
        let range = document.createRange()
        range.setStart(node, position)
        range.collapse(true)
        sel.removeAllRanges()
        sel.addRange(range)
    }
    

    setCaretPosAfterNode(node) {
        this.ce.focus()

        if (! node) return

        // Find textnode
        if (node.nodeType != 3) node = node.childNodes[0]

        let position = node.length

        // Set cursor position
        let sel = window.getSelection()
        let range = document.createRange()
        range.setStart(node, position)
        range.collapse(true)
        sel.removeAllRanges()
        sel.addRange(range)
    }

    /**
     * Tag List functions
     */
    checkTaglist() {
        this.hideTaglist()

        let node = this.getCaretNode()

        if (node && node.nodeName == 'SPAN') {
            let tags = this.findTags(node.innerText)
            if (tags.length > 0) {
                this.showTaglist(node, tags)
            }
        }
    }

    showTaglist(element, tags) {
        this.hideTaglist()

        this.tl = document.createElement('ul')
        
        this.tl.setAttribute('class', 'hashtag-cminds-tag-list')

        this.tl.style.top = element.getBoundingClientRect().top + 'px'
        this.tl.style.left = element.getBoundingClientRect().left + 'px'

        tags.forEach((tag) => {
            let li = document.createElement('li')

            li.innerHTML = tag.tag
            li.style.background = (tag.color) ? tag.color : this.op.color
            
            li.addEventListener("click", () => {
                this.selectTaglist(element, tag)
            }, false)

            this.tl.appendChild(li)
        })

        document.body.appendChild(this.tl)

        this.trigger('dropdown.show', this, this.el, this.tl)
    }

    hideTaglist() {
        if (this.tl) {
            document.body.removeChild(this.tl)
            delete this.tl

            this.trigger('dropdown.hide', this, this.el)
        }
    }

    selectTaglist(element, tag) {
        element.innerHTML = '#' + tag.tag
        element.style.background = (tag.color) ? tag.color : this.op.color

        this.hideTaglist()
        this.setCaretPosAfterNode(element)

        this.trigger('dropdown.select', this, this.el, element, tag)
    }

    /**
     * Events
     */
    on(name, callback) {
        if (! this.events) this.events = {}
        if (! this.events[name]) this.events[name] = []

        this.events[name].push(callback)
    }

    trigger(name, ...args) {
        if (! this.events || ! this.events[name]) return

        this.events[name].forEach((event) => {
            event(...args)
        })
    }

}

window.hashtagCM = (element, options) => {
    return new hashtagHelper(element, options)
}