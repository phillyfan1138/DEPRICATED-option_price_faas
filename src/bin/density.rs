extern crate black_scholes;
extern crate cf_dist_utils;
extern crate cf_functions;
extern crate fang_oost;
extern crate fang_oost_option;
extern crate lambda_http;
extern crate lambda_runtime as runtime;
extern crate num_complex;
extern crate rayon;
extern crate serde_derive;
#[macro_use]
extern crate serde_json;
extern crate utils;
use lambda_http::{lambda, IntoResponse, Request};
use runtime::{error::HandlerError, Context};
use std::error::Error;
use utils::constraints;
use utils::http_helper;
use utils::maps;

const DENSITY_SCALE: f64 = 5.0;

fn main() -> Result<(), Box<dyn Error>> {
    lambda!(density_wrapper);
    Ok(())
}
fn density_wrapper(event: Request, _ctx: Context) -> Result<impl IntoResponse, HandlerError> {
    match density(event) {
        Ok(res) => Ok(http_helper::build_response(200, &json!(res).to_string())),
        Err(e) => Ok(http_helper::build_response(
            400,
            &http_helper::construct_error(&e.to_string()),
        )),
    }
}
fn density(event: Request) -> Result<Vec<maps::GraphElement>, Box<dyn Error>> {
    let parameters: constraints::OptionParameters = serde_json::from_reader(event.body().as_ref())?;

    constraints::check_parameters(&parameters, &constraints::get_constraints())?;

    let constraints::OptionParameters {
        maturity,
        rate,
        num_u: num_u_base,
        cf_parameters,
        ..
    } = parameters; //destructure

    let num_u = (2 as usize).pow(num_u_base as u32);

    let results =
        maps::get_density_results_as_json(&cf_parameters, DENSITY_SCALE, num_u, maturity, rate)?;
    Ok(results)
}
