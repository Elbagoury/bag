import { animationFrame } from "@bag/hoot-mock";
import { describe, expect, test } from "@bag/hoot";

import { BagBarChart } from "@spreadsheet/chart/bag_chart/bag_bar_chart";
import { BagChart } from "@spreadsheet/chart/bag_chart/bag_chart";
import { BagLineChart } from "@spreadsheet/chart/bag_chart/bag_line_chart";

import {
    createSpreadsheetWithChart,
    insertChartInSpreadsheet,
} from "@spreadsheet/../tests/helpers/chart";
import { insertListInSpreadsheet } from "@spreadsheet/../tests/helpers/list";
import { createModelWithDataSource } from "@spreadsheet/../tests/helpers/model";
import { addGlobalFilter } from "@spreadsheet/../tests/helpers/commands";
import { THIS_YEAR_GLOBAL_FILTER } from "@spreadsheet/../tests/helpers/global_filter";
import { mockService, makeServerError } from "@web/../tests/web_test_helpers";
import * as spreadsheet from "@bag/o-spreadsheet";

import { user } from "@web/core/user";
import {
    getBasicServerData,
    defineSpreadsheetActions,
    defineSpreadsheetModels,
} from "@spreadsheet/../tests/helpers/data";
import { waitForDataLoaded } from "@spreadsheet/helpers/model";

const { toZone } = spreadsheet.helpers;

const fr_FR = {
    name: "French",
    code: "fr_FR",
    thousandsSeparator: " ",
    decimalSeparator: ",",
    dateFormat: "dd/mm/yyyy",
    timeFormat: "hh:mm:ss",
    formulaArgSeparator: ";",
};

describe.current.tags("headless");
defineSpreadsheetModels();
defineSpreadsheetActions();

test("Can add an Bag Bar chart", async () => {
    const { model } = await createSpreadsheetWithChart({ type: "bag_bar" });
    const sheetId = model.getters.getActiveSheetId();
    expect(model.getters.getChartIds(sheetId).length).toBe(1);
    const chartId = model.getters.getChartIds(sheetId)[0];
    const chart = model.getters.getChart(chartId);
    expect(chart instanceof BagBarChart).toBe(true);
    expect(chart.getDefinitionForExcel()).toBe(undefined);
    expect(model.getters.getChartRuntime(chartId).chartJsConfig.type).toBe("bar");
});

test("Can add an Bag Line chart", async () => {
    const { model } = await createSpreadsheetWithChart({ type: "bag_line" });
    const sheetId = model.getters.getActiveSheetId();
    expect(model.getters.getChartIds(sheetId).length).toBe(1);
    const chartId = model.getters.getChartIds(sheetId)[0];
    const chart = model.getters.getChart(chartId);
    expect(chart instanceof BagLineChart).toBe(true);
    expect(chart.getDefinitionForExcel()).toBe(undefined);
    expect(model.getters.getChartRuntime(chartId).chartJsConfig.type).toBe("line");
});

test("Can add an Bag Pie chart", async () => {
    const { model } = await createSpreadsheetWithChart({ type: "bag_pie" });
    const sheetId = model.getters.getActiveSheetId();
    expect(model.getters.getChartIds(sheetId).length).toBe(1);
    const chartId = model.getters.getChartIds(sheetId)[0];
    const chart = model.getters.getChart(chartId);
    expect(chart instanceof BagChart).toBe(true);
    expect(chart.getDefinitionForExcel()).toBe(undefined);
    expect(model.getters.getChartRuntime(chartId).chartJsConfig.type).toBe("pie");
});

test("A data source is added after a chart creation", async () => {
    const { model } = await createSpreadsheetWithChart();
    const sheetId = model.getters.getActiveSheetId();
    const chartId = model.getters.getChartIds(sheetId)[0];
    expect(model.getters.getChartDataSource(chartId)).not.toBe(undefined);
});

test("Bag bar chart runtime loads the data", async () => {
    const { model } = await createSpreadsheetWithChart({
        type: "bag_bar",
        mockRPC: async function (route, args) {
            if (args.method === "web_read_group") {
                expect.step("web_read_group");
            }
        },
    });
    const sheetId = model.getters.getActiveSheetId();
    const chartId = model.getters.getChartIds(sheetId)[0];
    // it should not be loaded eagerly
    expect.verifySteps([]);
    expect(model.getters.getChartRuntime(chartId).chartJsConfig.data).toEqual({
        datasets: [],
        labels: [],
    });
    await animationFrame();
    expect(model.getters.getChartRuntime(chartId).chartJsConfig.data).toEqual({
        datasets: [
            {
                backgroundColor: "#4EA7F2",
                borderColor: "#FFFFFF",
                borderWidth: 1,
                data: [1, 3],
                label: "Count",
            },
        ],
        labels: ["false", "true"],
    });
    // it should have loaded the data
    expect.verifySteps(["web_read_group"]);
});

test("Bag pie chart runtime loads the data", async () => {
    const { model } = await createSpreadsheetWithChart({
        type: "bag_pie",
        mockRPC: async function (route, args) {
            if (args.method === "web_read_group") {
                expect.step("web_read_group");
            }
        },
    });
    const sheetId = model.getters.getActiveSheetId();
    const chartId = model.getters.getChartIds(sheetId)[0];
    // it should not be loaded eagerly
    expect.verifySteps([]);
    expect(model.getters.getChartRuntime(chartId).chartJsConfig.data).toEqual({
        datasets: [],
        labels: [],
    });
    await animationFrame();
    expect(model.getters.getChartRuntime(chartId).chartJsConfig.data).toEqual({
        datasets: [
            {
                backgroundColor: ["#4EA7F2", "#EA6175", "#43C5B1"],
                borderColor: "#FFFFFF",
                data: [1, 3],
                hoverOffset: 30,
                label: "",
            },
        ],
        labels: ["false", "true"],
    });
    // it should have loaded the data
    expect.verifySteps(["web_read_group"]);
});

test("Bag line chart runtime loads the data", async () => {
    const { model } = await createSpreadsheetWithChart({
        type: "bag_line",
        mockRPC: async function (route, args) {
            if (args.method === "web_read_group") {
                expect.step("web_read_group");
            }
        },
    });
    const sheetId = model.getters.getActiveSheetId();
    const chartId = model.getters.getChartIds(sheetId)[0];
    // it should not be loaded eagerly
    expect.verifySteps([]);
    expect(model.getters.getChartRuntime(chartId).chartJsConfig.data).toEqual({
        datasets: [],
        labels: [],
    });
    await animationFrame();
    expect(model.getters.getChartRuntime(chartId).chartJsConfig.data).toEqual({
        datasets: [
            {
                backgroundColor: "#4EA7F2",
                borderColor: "#4EA7F2",
                data: [1, 3],
                label: "Count",
                lineTension: 0,
                fill: false,
                pointBackgroundColor: "#4EA7F2",
            },
        ],
        labels: ["false", "true"],
    });
    // it should have loaded the data
    expect.verifySteps(["web_read_group"]);
});

test("Area charts are supported", async () => {
    const { model } = await createSpreadsheetWithChart({ type: "bag_line" });
    await waitForDataLoaded(model);
    const sheetId = model.getters.getActiveSheetId();
    const chartId = model.getters.getChartIds(sheetId)[0];
    const definition = model.getters.getChartDefinition(chartId);
    model.dispatch("UPDATE_CHART", {
        definition: { ...definition, fillArea: true, stacked: false },
        id: chartId,
        sheetId,
    });
    let runtime = model.getters.getChartRuntime(chartId).chartJsConfig;
    expect(runtime.options.scales.x.stacked).toBe(undefined);
    expect(runtime.options.scales.y.stacked).toBe(undefined);
    expect(runtime.data.datasets[0].fill).toBe("origin");
    model.dispatch("UPDATE_CHART", {
        definition: { ...definition, fillArea: true, stacked: true },
        id: chartId,
        sheetId,
    });
    runtime = model.getters.getChartRuntime(chartId).chartJsConfig;
    expect(runtime.options.scales.x.stacked).toBe(undefined);
    expect(runtime.options.scales.y.stacked).toBe(true);
    expect(runtime.data.datasets[0].fill).toBe("origin");
});

test("Data reloaded strictly upon domain update", async () => {
    const { model } = await createSpreadsheetWithChart({
        type: "bag_line",
        mockRPC: async function (route, args) {
            if (args.method === "web_read_group") {
                expect.step("web_read_group");
            }
        },
    });
    const sheetId = model.getters.getActiveSheetId();
    const chartId = model.getters.getChartIds(sheetId)[0];
    const definition = model.getters.getChartDefinition(chartId);

    // force runtime computation
    model.getters.getChartRuntime(chartId);
    await animationFrame();
    // it should have loaded the data
    expect.verifySteps(["web_read_group"]);

    model.dispatch("UPDATE_CHART", {
        definition: {
            ...definition,
            searchParams: { ...definition.searchParams, domain: [["1", "=", "1"]] },
        },
        id: chartId,
        sheetId,
    });
    // force runtime computation
    model.getters.getChartRuntime(chartId);
    await animationFrame();
    // it should have loaded the data with a new domain
    expect.verifySteps(["web_read_group"]);

    const newDefinition = model.getters.getChartDefinition(chartId);
    model.dispatch("UPDATE_CHART", {
        definition: {
            ...newDefinition,
            background: "#00FF00",
        },
        id: chartId,
        sheetId,
    });
    // force runtime computation
    model.getters.getChartRuntime(chartId);
    await animationFrame();
    // it should have not have loaded the data since the domain was unchanged
    expect.verifySteps([]);
});

test("Can import/export an Bag chart", async () => {
    const model = await createModelWithDataSource();
    insertChartInSpreadsheet(model, "bag_line");
    const data = model.exportData();
    const figures = data.sheets[0].figures;
    expect(figures.length).toBe(1);
    const figure = figures[0];
    expect(figure.tag).toBe("chart");
    expect(figure.data.type).toBe("bag_line");
    const m1 = await createModelWithDataSource({ spreadsheetData: data });
    const sheetId = m1.getters.getActiveSheetId();
    expect(m1.getters.getChartIds(sheetId).length).toBe(1);
    const chartId = m1.getters.getChartIds(sheetId)[0];
    expect(model.getters.getChartDataSource(chartId)).not.toBe(undefined);
    expect(m1.getters.getChartRuntime(chartId).chartJsConfig.type).toBe("line");
});

test("can import (export) contextual domain", async function () {
    const chartId = "1";
    const uid = user.userId;
    const spreadsheetData = {
        sheets: [
            {
                figures: [
                    {
                        id: chartId,
                        x: 10,
                        y: 10,
                        width: 536,
                        height: 335,
                        tag: "chart",
                        data: {
                            type: "bag_line",
                            title: { text: "Partners" },
                            legendPosition: "top",
                            searchParams: {
                                domain: '[("foo", "=", uid)]',
                                groupBy: [],
                                orderBy: [],
                            },
                            metaData: {
                                groupBy: ["foo"],
                                measure: "__count",
                                resModel: "partner",
                            },
                        },
                    },
                ],
            },
        ],
    };
    const model = await createModelWithDataSource({
        spreadsheetData,
        mockRPC: function (route, args) {
            if (args.method === "web_read_group") {
                expect(args.kwargs.domain).toEqual([["foo", "=", uid]]);
                expect.step("web_read_group");
            }
        },
    });
    model.getters.getChartRuntime(chartId).chartJsConfig.data; // force loading the chart data
    await animationFrame();
    expect(model.exportData().sheets[0].figures[0].data.searchParams.domain).toBe(
        '[("foo", "=", uid)]',
        { message: "the domain is exported with the dynamic parts" }
    );
    expect.verifySteps(["web_read_group"]);
});

test("Can undo/redo an Bag chart creation", async () => {
    const model = await createModelWithDataSource();
    insertChartInSpreadsheet(model, "bag_line");
    const sheetId = model.getters.getActiveSheetId();
    const chartId = model.getters.getChartIds(sheetId)[0];
    expect(model.getters.getChartDataSource(chartId)).not.toBe(undefined);
    model.dispatch("REQUEST_UNDO");
    expect(model.getters.getChartIds(sheetId).length).toBe(0);
    model.dispatch("REQUEST_REDO");
    expect(model.getters.getChartDataSource(chartId)).not.toBe(undefined);
    expect(model.getters.getChartIds(sheetId).length).toBe(1);
});

test("charts with no legend", async () => {
    const { model } = await createSpreadsheetWithChart({ type: "bag_pie" });
    insertChartInSpreadsheet(model, "bag_bar");
    insertChartInSpreadsheet(model, "bag_line");
    const sheetId = model.getters.getActiveSheetId();
    const [pieChartId, barChartId, lineChartId] = model.getters.getChartIds(sheetId);
    const pie = model.getters.getChartDefinition(pieChartId);
    const bar = model.getters.getChartDefinition(barChartId);
    const line = model.getters.getChartDefinition(lineChartId);
    expect(
        model.getters.getChartRuntime(pieChartId).chartJsConfig.options.plugins.legend.display
    ).toBe(true);
    expect(
        model.getters.getChartRuntime(barChartId).chartJsConfig.options.plugins.legend.display
    ).toBe(true);
    expect(
        model.getters.getChartRuntime(lineChartId).chartJsConfig.options.plugins.legend.display
    ).toBe(true);
    model.dispatch("UPDATE_CHART", {
        definition: {
            ...pie,
            legendPosition: "none",
        },
        id: pieChartId,
        sheetId,
    });
    model.dispatch("UPDATE_CHART", {
        definition: {
            ...bar,
            legendPosition: "none",
        },
        id: barChartId,
        sheetId,
    });
    model.dispatch("UPDATE_CHART", {
        definition: {
            ...line,
            legendPosition: "none",
        },
        id: lineChartId,
        sheetId,
    });
    expect(
        model.getters.getChartRuntime(pieChartId).chartJsConfig.options.plugins.legend.display
    ).toBe(false);
    expect(
        model.getters.getChartRuntime(barChartId).chartJsConfig.options.plugins.legend.display
    ).toBe(false);
    expect(
        model.getters.getChartRuntime(lineChartId).chartJsConfig.options.plugins.legend.display
    ).toBe(false);
});

test("Bar chart with stacked attribute is supported", async () => {
    const { model } = await createSpreadsheetWithChart({ type: "bag_bar" });
    const sheetId = model.getters.getActiveSheetId();
    const chartId = model.getters.getChartIds(sheetId)[0];
    const definition = model.getters.getChartDefinition(chartId);
    model.dispatch("UPDATE_CHART", {
        definition: {
            ...definition,
            stacked: true,
        },
        id: chartId,
        sheetId,
    });
    expect(model.getters.getChartRuntime(chartId).chartJsConfig.options.scales.x.stacked).toBe(
        true
    );
    expect(model.getters.getChartRuntime(chartId).chartJsConfig.options.scales.y.stacked).toBe(
        true
    );
    model.dispatch("UPDATE_CHART", {
        definition: {
            ...definition,
            stacked: false,
        },
        id: chartId,
        sheetId,
    });
    expect(model.getters.getChartRuntime(chartId).chartJsConfig.options.scales.x.stacked).toBe(
        undefined
    );
    expect(model.getters.getChartRuntime(chartId).chartJsConfig.options.scales.y.stacked).toBe(
        undefined
    );
});

test("Can copy/paste Bag chart", async () => {
    const { model } = await createSpreadsheetWithChart({ type: "bag_pie" });
    const sheetId = model.getters.getActiveSheetId();
    const chartId = model.getters.getChartIds(sheetId)[0];
    model.dispatch("SELECT_FIGURE", { id: chartId });
    model.dispatch("COPY");
    model.dispatch("PASTE", { target: [toZone("A1")] });
    const chartIds = model.getters.getChartIds(sheetId);
    expect(chartIds.length).toBe(2);
    expect(model.getters.getChart(chartIds[1]) instanceof BagChart).toBe(true);
    expect(JSON.stringify(model.getters.getChartRuntime(chartIds[1]))).toBe(
        JSON.stringify(model.getters.getChartRuntime(chartId))
    );

    expect(model.getters.getChart(chartId).dataSource).not.toBe(
        model.getters.getChart(chartIds[1]).dataSource,
        { message: "The datasource is also duplicated" }
    );
});

test("Can cut/paste Bag chart", async () => {
    const { model } = await createSpreadsheetWithChart({ type: "bag_pie" });
    const sheetId = model.getters.getActiveSheetId();
    const chartId = model.getters.getChartIds(sheetId)[0];
    const chartRuntime = model.getters.getChartRuntime(chartId);
    model.dispatch("SELECT_FIGURE", { id: chartId });
    model.dispatch("CUT");
    model.dispatch("PASTE", { target: [toZone("A1")] });
    const chartIds = model.getters.getChartIds(sheetId);
    expect(chartIds.length).toBe(1);
    expect(chartIds[0]).not.toBe(chartId);
    expect(model.getters.getChart(chartIds[0]) instanceof BagChart).toBe(true);
    expect(JSON.stringify(model.getters.getChartRuntime(chartIds[0]))).toBe(
        JSON.stringify(chartRuntime)
    );
});

test("Duplicating a sheet correctly duplicates Bag chart", async () => {
    const { model } = await createSpreadsheetWithChart({ type: "bag_bar" });
    const sheetId = model.getters.getActiveSheetId();
    const secondSheetId = "secondSheetId";
    const chartId = model.getters.getChartIds(sheetId)[0];
    model.dispatch("DUPLICATE_SHEET", { sheetId, sheetIdTo: secondSheetId });
    const chartIds = model.getters.getChartIds(secondSheetId);
    expect(chartIds.length).toBe(1);
    expect(model.getters.getChart(chartIds[0]) instanceof BagChart).toBe(true);
    expect(JSON.stringify(model.getters.getChartRuntime(chartIds[0]))).toBe(
        JSON.stringify(model.getters.getChartRuntime(chartId))
    );

    expect(model.getters.getChart(chartId).dataSource).not.toBe(
        model.getters.getChart(chartIds[0]).dataSource,
        { message: "The datasource is also duplicated" }
    );
});

test("Line chart with stacked attribute is supported", async () => {
    const { model } = await createSpreadsheetWithChart({ type: "bag_line" });
    const sheetId = model.getters.getActiveSheetId();
    const chartId = model.getters.getChartIds(sheetId)[0];
    const definition = model.getters.getChartDefinition(chartId);
    model.dispatch("UPDATE_CHART", {
        definition: {
            ...definition,
            stacked: true,
        },
        id: chartId,
        sheetId,
    });
    expect(model.getters.getChartRuntime(chartId).chartJsConfig.options.scales.x.stacked).toBe(
        undefined
    );
    expect(model.getters.getChartRuntime(chartId).chartJsConfig.options.scales.y.stacked).toBe(
        true
    );
    model.dispatch("UPDATE_CHART", {
        definition: {
            ...definition,
            stacked: false,
        },
        id: chartId,
        sheetId,
    });
    expect(model.getters.getChartRuntime(chartId).chartJsConfig.options.scales.x.stacked).toBe(
        undefined
    );
    expect(model.getters.getChartRuntime(chartId).chartJsConfig.options.scales.y.stacked).toBe(
        undefined
    );
});

test("Load bag chart spreadsheet with models that cannot be accessed", async function () {
    let hasAccessRights = true;
    const { model } = await createSpreadsheetWithChart({
        mockRPC: async function (route, args) {
            if (args.model === "partner" && args.method === "web_read_group" && !hasAccessRights) {
                throw makeServerError({ description: "ya done!" });
            }
        },
    });
    const chartId = model.getters.getFigures(model.getters.getActiveSheetId())[0].id;
    const chartDataSource = model.getters.getChartDataSource(chartId);
    await waitForDataLoaded(model);
    const data = chartDataSource.getData();
    expect(data.datasets.length).toBe(1);
    expect(data.labels.length).toBe(2);

    hasAccessRights = false;
    chartDataSource.load({ reload: true });
    await waitForDataLoaded(model);
    expect(chartDataSource.getData()).toEqual({ datasets: [], labels: [] });
});

test("Line chart to support cumulative data", async () => {
    const { model } = await createSpreadsheetWithChart({ type: "bag_line" });
    const sheetId = model.getters.getActiveSheetId();
    const chartId = model.getters.getChartIds(sheetId)[0];
    const definition = model.getters.getChartDefinition(chartId);
    await waitForDataLoaded(model);
    expect(model.getters.getChartRuntime(chartId).chartJsConfig.data.datasets[0].data).toEqual([
        1, 3,
    ]);
    model.dispatch("UPDATE_CHART", {
        definition: {
            ...definition,
            cumulative: true,
        },
        id: chartId,
        sheetId,
    });
    expect(model.getters.getChartRuntime(chartId).chartJsConfig.data.datasets[0].data).toEqual([
        1, 4,
    ]);
    model.dispatch("UPDATE_CHART", {
        definition: {
            ...definition,
            cumulative: false,
        },
        id: chartId,
        sheetId,
    });
    expect(model.getters.getChartRuntime(chartId).chartJsConfig.data.datasets[0].data).toEqual([
        1, 3,
    ]);
});

test("cumulative line chart with past data before domain period", async () => {
    const serverData = getBasicServerData();
    serverData.models.partner.records = [
        { date: "2020-01-01", probability: 10 },
        { date: "2021-01-01", probability: 2 },
        { date: "2022-01-01", probability: 3 },
        { date: "2022-03-01", probability: 4 },
        { date: "2022-06-01", probability: 5 },
    ];
    const { model } = await createSpreadsheetWithChart({
        type: "bag_line",
        serverData,
        definition: {
            type: "bag_line",
            metaData: {
                groupBy: ["date"],
                measure: "probability",
                order: null,
                resModel: "partner",
            },
            searchParams: {
                comparison: null,
                context: {},
                domain: [
                    ["date", ">=", "2022-01-01"],
                    ["date", "<=", "2022-12-31"],
                ],
                groupBy: [],
                orderBy: [],
            },
            cumulative: true,
            title: { text: "Partners" },
            dataSourceId: "42",
            id: "42",
        },
    });
    const sheetId = model.getters.getActiveSheetId();
    const chartId = model.getters.getChartIds(sheetId)[0];
    await waitForDataLoaded(model);
    expect(model.getters.getChartRuntime(chartId).chartJsConfig.data.datasets[0].data).toEqual([
        15, 19, 24,
    ]);
});

test("Can insert bag chart from a different model", async () => {
    const model = await createModelWithDataSource();
    insertListInSpreadsheet(model, { model: "product", columns: ["name"] });
    await addGlobalFilter(model, THIS_YEAR_GLOBAL_FILTER);
    const sheetId = model.getters.getActiveSheetId();
    expect(model.getters.getChartIds(sheetId).length).toBe(0);
    insertChartInSpreadsheet(model);
    expect(model.getters.getChartIds(sheetId).length).toBe(1);
});

test("Bag chart legend color changes with background color update", async () => {
    const { model } = await createSpreadsheetWithChart({ type: "bag_bar" });
    const sheetId = model.getters.getActiveSheetId();
    const chartId = model.getters.getChartIds(sheetId)[0];
    const definition = model.getters.getChartDefinition(chartId);
    expect(
        model.getters.getChartRuntime(chartId).chartJsConfig.options.plugins.legend.labels.color
    ).toBe("#000000");
    model.dispatch("UPDATE_CHART", {
        definition: {
            ...definition,
            background: "#000000",
        },
        id: chartId,
        sheetId,
    });
    expect(
        model.getters.getChartRuntime(chartId).chartJsConfig.options.plugins.legend.labels.color
    ).toBe("#FFFFFF");
});

test("Remove bag chart when sheet is deleted", async () => {
    const { model } = await createSpreadsheetWithChart({ type: "bag_line" });
    const sheetId = model.getters.getActiveSheetId();
    model.dispatch("CREATE_SHEET", {
        sheetId: model.uuidGenerator.uuidv4(),
        position: model.getters.getSheetIds().length,
    });
    expect(model.getters.getBagChartIds().length).toBe(1);
    model.dispatch("DELETE_SHEET", { sheetId });
    expect(model.getters.getBagChartIds().length).toBe(0);
});

test("Bag chart datasource display name has a default when the chart title is empty", async () => {
    const { model } = await createSpreadsheetWithChart({ type: "bag_line" });
    const sheetId = model.getters.getActiveSheetId();
    const chartId = model.getters.getChartIds(sheetId)[0];
    const definition = model.getters.getChartDefinition(chartId);
    expect(model.getters.getBagChartDisplayName(chartId)).toBe("(#1) Partners");
    model.dispatch("UPDATE_CHART", {
        definition: {
            ...definition,
            title: { text: "" },
        },
        id: chartId,
        sheetId,
    });
    expect(model.getters.getBagChartDisplayName(chartId)).toBe("(#1) Bag Line Chart");
});

test("See records when clicking on a bar chart bar", async () => {
    const action = {
        domain: [
            ["date", ">=", "2022-01-01"],
            ["date", "<", "2022-02-01"],
            "&",
            ["date", ">=", "2022-01-01"],
            ["date", "<=", "2022-12-31"],
        ],
        name: "January 2022 / Probability",
        res_model: "partner",
        target: "current",
        type: "ir.actions.act_window",
        views: [
            [false, "list"],
            [false, "form"],
        ],
    };
    const fakeActionService = {
        doAction: async (request, options = {}) => {
            if (request.type === "ir.actions.act_window") {
                expect.step("do-action");
                expect(request).toEqual(action);
            }
        },
        loadAction(actionRequest) {
            expect.step("load-action");
            expect(actionRequest).toBe("test.my_action");
            return action;
        },
    };
    mockService("action", fakeActionService);
    const serverData = getBasicServerData();
    serverData.models.partner.records = [
        { date: "2020-01-01", probability: 10 },
        { date: "2021-01-01", probability: 2 },
        { date: "2022-01-01", probability: 3 },
        { date: "2022-03-01", probability: 4 },
        { date: "2022-06-01", probability: 5 },
    ];
    const { model } = await createSpreadsheetWithChart({
        type: "bag_bar",
        serverData,
        definition: {
            type: "bag_bar",
            metaData: {
                groupBy: ["date"],
                measure: "probability",
                order: null,
                resModel: "partner",
            },
            searchParams: {
                comparison: null,
                context: {},
                domain: [
                    ["date", ">=", "2022-01-01"],
                    ["date", "<=", "2022-12-31"],
                ],
                groupBy: [],
                orderBy: [],
            },
            actionXmlId: "test.my_action",
            cumulative: true,
            title: { text: "Partners" },
            dataSourceId: "42",
            id: "42",
        },
    });
    const sheetId = model.getters.getActiveSheetId();
    const chartId = model.getters.getChartIds(sheetId)[0];
    await waitForDataLoaded(model);
    const runtime = model.getters.getChartRuntime(chartId);
    expect.verifySteps([]);

    await runtime.chartJsConfig.options.onClick(undefined, [{ datasetIndex: 0, index: 0 }]);
    await animationFrame();
    expect.verifySteps(["load-action", "do-action"]);
});

test("See records when clicking on a pie chart slice", async () => {
    const fakeActionService = {
        doAction: async (request, options = {}) => {
            if (request.type === "ir.actions.act_window") {
                expect.step("do-action");
                expect(request).toEqual({
                    domain: [
                        ["date", ">=", "2022-01-01"],
                        ["date", "<", "2022-02-01"],
                        "&",
                        ["date", ">=", "2022-01-01"],
                        ["date", "<=", "2022-12-31"],
                    ],
                    name: "January 2022",
                    res_model: "partner",
                    target: "current",
                    type: "ir.actions.act_window",
                    views: [
                        [false, "list"],
                        [false, "form"],
                    ],
                });
            }
        },
    };
    mockService("action", fakeActionService);
    const serverData = getBasicServerData();
    serverData.models.partner.records = [
        { date: "2020-01-01", probability: 10 },
        { date: "2021-01-01", probability: 2 },
        { date: "2022-01-01", probability: 3 },
        { date: "2022-03-01", probability: 4 },
        { date: "2022-06-01", probability: 5 },
    ];
    const { model } = await createSpreadsheetWithChart({
        type: "bag_pie",
        serverData,
        definition: {
            type: "bag_pie",
            metaData: {
                groupBy: ["date"],
                measure: "probability",
                resModel: "partner",
            },
            searchParams: {
                context: {},
                domain: [
                    ["date", ">=", "2022-01-01"],
                    ["date", "<=", "2022-12-31"],
                ],
                groupBy: [],
                orderBy: [],
            },
            cumulative: true,
            title: { text: "Partners" },
            dataSourceId: "42",
            id: "42",
        },
    });
    const sheetId = model.getters.getActiveSheetId();
    const chartId = model.getters.getChartIds(sheetId)[0];
    await waitForDataLoaded(model);

    const runtime = model.getters.getChartRuntime(chartId);
    expect.verifySteps([]);

    await runtime.chartJsConfig.options.onClick(undefined, [{ datasetIndex: 0, index: 0 }]);
    await animationFrame();
    expect.verifySteps(["do-action"]);
});

test("import/export action xml id", async () => {
    const { model } = await createSpreadsheetWithChart({
        type: "bag_bar",
        definition: {
            type: "bag_bar",
            metaData: {
                groupBy: [],
                measure: "probability",
                resModel: "partner",
            },
            searchParams: {
                domain: [],
                groupBy: [],
                orderBy: [],
            },
            actionXmlId: "test.my_action",
            cumulative: true,
            title: { text: "Partners" },
            dataSourceId: "42",
            id: "42",
        },
    });
    const exported = model.exportData();
    expect(exported.sheets[0].figures[0].data.actionXmlId).toBe("test.my_action");

    const model2 = await createModelWithDataSource({ spreadsheetData: exported });
    const sheetId = model2.getters.getActiveSheetId();
    const chartId = model2.getters.getChartIds(sheetId)[0];
    expect(model2.getters.getChartDefinition(chartId).actionXmlId).toBe("test.my_action");
});

test("Show values is taken into account in the runtime", async () => {
    const { model } = await createSpreadsheetWithChart({ type: "bag_bar" });
    const sheetId = model.getters.getActiveSheetId();
    const chartId = model.getters.getChartIds(sheetId)[0];
    const definition = model.getters.getChartDefinition(chartId);
    model.dispatch("UPDATE_CHART", {
        definition: {
            ...definition,
            showValues: true,
        },
        id: chartId,
        sheetId,
    });
    const runtime = model.getters.getChartRuntime(chartId);
    expect(runtime.chartJsConfig.options.plugins.chartShowValuesPlugin.showValues).toBe(true);
});

test("Displays correct thousand separator for positive value in Bag Bar chart Y-axis", async () => {
    const { model } = await createSpreadsheetWithChart({ type: "bag_bar" });
    const sheetId = model.getters.getActiveSheetId();
    const chartId = model.getters.getChartIds(sheetId)[0];
    const runtime = model.getters.getChartRuntime(chartId);
    expect(runtime.chartJsConfig.options.scales.y?.ticks.callback(60000000)).toBe("60,000,000");
    expect(runtime.chartJsConfig.options.scales.y?.ticks.callback(-60000000)).toBe("-60,000,000");
});

test("Thousand separator in Bag Bar chart Y-axis is locale-dependent", async () => {
    const { model } = await createSpreadsheetWithChart({ type: "bag_bar" });
    model.dispatch("UPDATE_LOCALE", { locale: fr_FR });
    const sheetId = model.getters.getActiveSheetId();
    const chartId = model.getters.getChartIds(sheetId)[0];
    const runtime = model.getters.getChartRuntime(chartId);
    expect(runtime.chartJsConfig.options.scales.y?.ticks.callback(60000000)).toBe("60 000 000");
    expect(runtime.chartJsConfig.options.scales.y?.ticks.callback(-60000000)).toBe("-60 000 000");
});

test("Chart data source is recreated when chart type is updated", async () => {
    const { model } = await createSpreadsheetWithChart({ type: "bag_bar" });
    const sheetId = model.getters.getActiveSheetId();
    const chartId = model.getters.getChartIds(sheetId)[0];
    const chartDataSource = model.getters.getChartDataSource(chartId);
    model.dispatch("UPDATE_CHART", {
        definition: {
            ...model.getters.getChartDefinition(chartId),
            type: "bag_line",
        },
        id: chartId,
        sheetId,
    });
    expect(chartDataSource !== model.getters.getChartDataSource(chartId)).toBe(true, {
        message: "The data source should have been recreated",
    });
});
