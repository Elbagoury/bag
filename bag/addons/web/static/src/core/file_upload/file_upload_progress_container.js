import { Component } from "@bag/owl";

export class FileUploadProgressContainer extends Component {
    static template = "web.FileUploadProgressContainer";
    static props = {
        Component: { optional: false },
        shouldDisplay: { type: Function, optional: true },
        fileUploads: { type: Object },
    };
}
