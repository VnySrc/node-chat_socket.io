import path from "path"

export const RenderPage = (req, res) => {
    res.render(path.resolve("public"))
}
