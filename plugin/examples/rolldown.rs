// use rspack::compiler::{Compiler, CompilerOptions};
// use rspack::config::{Config, EntryDescription};
// use std::collections::HashMap;

// fn main() {
//     // 构建最小配置
//     let config = Config {
//         entry: {
//             let mut entry_map = HashMap::new();
//             entry_map.insert("main".to_string(), EntryDescription {
//                 import: vec!["./src/index.ts".to_string()],
//                 ..Default::default()
//             });
//             entry_map
//         },
//         ..Default::default()
//     };

//     let mut compiler = Compiler::new(config).expect("Failed to create compiler");

//     compiler.run().expect("Build failed");
// }