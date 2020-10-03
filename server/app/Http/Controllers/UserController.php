<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class UserController extends Controller {

	public function addUser(Request $request) {
		$this->validate($request,["full_name" => "required",
								  "email" => "required|email|unique:users,email",	
								  "password" => "required|min:6",	
									]);
		$file_name = "";							
		if($file = $request->file('avatar')) {
			
			$ext = strtolower($file->getClientOriginalExtension());
			if(in_array($ext,["png","jpg", "jpeg"])) {
				$file_name = uniqid($request->get('email')).".".$ext;
				$file->move("uploads",$file_name);  
			} else {
				return response()->json(["message"=>"File Error","errors"=>["avatar" =>["Only jpg, jpeg and png image allowed"] ] ],422);
			}	
		}
		
		$data['name'] = $request->get('full_name');
		$data['email'] = $request->get('email');
		$data['password'] = bcrypt($request->get('password'));
		$data['created_at'] = date("Y-m-d H:i:s");
		$data['avatar'] = $file_name;
		
		app('db')->table('users')->insert($data);
		
		return response()->json(['message'=>'hello']);
		
	}
	
	public function login(Request $request) {
		$this->validate($request,["email" => "required|email|exists:users,email","password"=>"required"]);
		
		$credentials = $request->only('email', 'password');
		/*
		if (! $token = auth('api')->attempt($credentials)) {
            return response()->json(['error' => 'Email or Password is incorrect'], 401);
        }

		*/

        try {
            // attempt to verify the credentials and create a token for the user
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json([
                    "error" => "invalid_credentials",
                    "message" => "The user credentials were incorrect. "
                ], 401);
            }
        } catch (JWTException $e) {
            // something went wrong whilst attempting to encode the token
            return response()->json([
                "error" => "could_not_create_token",
                "message" => "Enable to process request."
            ], 422);
        }
		// all good so return the token
        $user =  User::where('email', $request->get('email'))->get()->first();
		
		$img_url = env('APP_URL')."/uploads/";
		$user->avatar = ($user->avatar) ? $img_url.$user->avatar : $img_url."profile_pic.png";
		$game_duration = (env('game_duration')) ? (int)env('game_duration') : 60;
        return response()->json([
            'user'  => $user,
            'token' => $token,
			'game_duration' => $game_duration
        ],200);
		
	}
	
	public function getUser()
    {
		$data['user'] = auth()->user();
		//$data['token'] = auth()->refresh();
		$img_url = env('APP_URL')."/uploads/";
		$data['user']->avatar = ($data['user']->avatar) ? $img_url.$data['user']->avatar : $img_url."profile_pic.png";
		$data['game_duration'] = (env('game_duration')) ? (int)env('game_duration') : 60;
        return response()->json($data);
    }
	
	public function getHistory(Request $request) {
		$user = auth()->user();
		if(!empty($user->id)) {
			$history = [];
			
			$query = app('db')->table('history')->where('user_id',$user->id)->orderBy('id','desc')->get();
			if($query) {
				foreach($query as $row) {
					$logs = app('db')->table('log')->where('game_id',$row->id)->orderBy('id','asc')->get();
					$row->logs = $logs;
					$history[] = $row;
				}
			}
			
			return response()->json(["history"=>$history]);
		} else {
			return response()->json(["error"=>"User Not found","message"=>"Authentication Failed"],422);
		}
	}
	
	public function postGame(Request $request) {
		$user = auth()->user();
		$user_id = ($user->id) ? $user->id : 0;
		$my_health = $request->get('my_health');
		$dragon_health = $request->get('dragon_health');
		$time_left = $request->get('time_left');
		$logs = $request->get('logs');
		
		$insert_data['user_id'] = $user_id;
		$insert_data['my_health'] = $my_health;
		$insert_data['dragon_health'] = $dragon_health;
		$insert_data['time_left'] = $time_left;
		$insert_data['won'] = ($my_health>$dragon_health) ? 1 : 0;
		$insert_data['created_at'] = date("Y-m-d H:i:s");
		
		$game_id = app('db')->table('history')->insertGetId($insert_data);
		
		if(!empty($logs)) {
			foreach($logs as $log) {
				app('db')->table('log')->insert(['game_id'=>$game_id,'user_id'=>$user_id,'description'=>$log]);
			}
		}
		
		return response()->json(['status'=>1,'message'=>'Game posted successfully']);
	}

}