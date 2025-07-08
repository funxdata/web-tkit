// use rspack::{
//     compiler::{Compiler, CompilerOptions},
//     Config,
// };
// use std::path::PathBuf;

// fn main() -> rspack::rspack_error::Result<()> {
//     let config = Config {
//         entry: vec![("main".to_string(), PathBuf::from("./src/app.ts"))].into_iter().collect(),
//         output: Some(rspack::OutputOptions {
//             filename: Some("bundle.js".into()),
//             path: Some(PathBuf::from("../dist")),
//             ..Default::default()
//         }),
//         mode: rspack::Mode::Production,
//         ..Default::default()
//     };

//     let compiler = Compiler::new(config)?;
//     compiler.run()?;

//     println!("Build complete!");
//     Ok(())
// }