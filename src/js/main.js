/**
 * Hashtag helper for Collective Minds Radiology
 */
class hashtagHelper {

    constructor(element, options) {
        this.setOptions(options);
        this.setElement(element);
        this.init();
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
        this.setCaretPos(this.getElementValue().length - 1)
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

    createContentTags() {
        let content = this.getHtmlContent()

        if (this.normalize(content) != this.normalize(this.getContentValue())) {
            let caret_position = this.getCaretPos()

            this.ce.innerHTML = content

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
        return this.ce.innerHTML
    }

    getHtmlContent() {
        return '<div>'+this.getHtmlTags().replace(/\n/g,'</div><div>')+'</div>'.replace(/<div><\/div>/g, '')
    }

    getHtmlTags() {
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
        });
    }

    bindContentEditable() {
        this.ce.addEventListener("input", () => {
            this.setContent(this.ce.innerText);
            this.createContentTags();
        }, false)
    }

    /**
     * Caret position
     */
    getAllTextnodes(){
        let n, a=[], walk=document.createTreeWalker(this.ce,NodeFilter.SHOW_TEXT,null,false);
        while(n=walk.nextNode()) a.push(n);
        return a;
    }
    getCaretPos() {
        this.ce.focus()

        let _range = document.getSelection().getRangeAt(0)
        let range = _range.cloneRange()
        range.selectNodeContents(this.ce)
        range.setEnd(_range.endContainer, _range.endOffset)

        return range.toString().length
    }
    setCaretPos(position) {
        this.ce.focus()

        if (position<=0) return

        // Get node element
        let node, nodes = this.getAllTextnodes()

        for (let i in nodes) {
            if (position - nodes[i].length > 0) {
                position -= nodes[i].length
            } else {
                node = nodes[i]
                break
            }
        }

        if (! node) return
        
        // Set cursor position
        let sel = window.getSelection()
        let range = document.createRange()
        range.setStart(node, position)
        range.collapse(true)
        sel.removeAllRanges()
        sel.addRange(range)
    }
}

window.hashtagCM = (element, options) => {
    return new hashtagHelper(element, options)
}