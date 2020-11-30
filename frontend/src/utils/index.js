export const findByTestAtrr = (component, attr) => {
    return component.find(`[data-test='${attr}']`)
}
