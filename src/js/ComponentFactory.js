const COMPONENTS = {
    'example-component': () => import('./components/ExampleComponent'),
    'three-component': () => import('./components/CanvasComponent'),
}

class ComponentFactory {
    constructor() {
        this._selector = 'data-component';
        this._elements = document.querySelectorAll(`[${this._selector}]`);
        this._components = {};
    }

    start() {
        for (let i = 0, limit = this._elements.length; i < limit; i++) {
            const element = this._elements[i];
            const componentName = element.getAttribute(this._selector);
            if (COMPONENTS[componentName]) {
                COMPONENTS[componentName]().then(function(value) {
                    new value.default({el: element});
                });
            }
            else {
                console.log(`Component: '${componentName}' not found`);
            }
        }
    }
}

export default new ComponentFactory();

